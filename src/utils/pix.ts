import QRCode from 'qrcode';

export interface PixPayloadOptions {
  receiverName: string;
  pixKey: string;
  city: string;
  amount: number;
  transactionId: string;
}

// Function to calculate CRC16-CCITT for standard BACEN Pix EMV
function calculateCrc16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Generates an official Brazilian BACEN Pix BR Code EMV string
 */
export function generatePixBrCode({
  receiverName = 'ADEGA BIGODE',
  pixKey = 'pix@adegabigode.com.br',
  city = 'SAO PAULO',
  amount,
  transactionId = 'BIGODE',
}: PixPayloadOptions): string {
  // Normalize strings
  const cleanKey = pixKey.trim();
  const cleanName = receiverName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 25);
  const cleanCity = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 15);
  const cleanTxId = transactionId.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';
  const formattedAmount = amount > 0 ? amount.toFixed(2) : '0.00';

  // Merchant Account Info (ID 26)
  const gui = formatField('00', 'br.gov.bcb.pix');
  const keyField = formatField('01', cleanKey);
  const merchantAccountInfo = formatField('26', `${gui}${keyField}`);

  // Additional Data (ID 62)
  const txField = formatField('05', cleanTxId);
  const additionalData = formatField('62', txField);

  // Core Payload without CRC
  const rawPayload = [
    formatField('00', '01'), // Format indicator
    formatField('01', '12'), // Point of Initiation Method (Dynamic/Static)
    merchantAccountInfo,
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'), // BRL Currency
    formatField('54', formattedAmount), // Amount
    formatField('58', 'BR'), // Country
    formatField('59', cleanName), // Merchant Name: ADEGA BIGODE
    formatField('60', cleanCity), // Merchant City
    additionalData,
    '6304', // CRC header
  ].join('');

  const crc = calculateCrc16(rawPayload);
  return `${rawPayload}${crc}`;
}

/**
 * Generates Data URL for QR Code rendering
 */
export async function generatePixQrCodeDataUrl(pixString: string): Promise<string> {
  try {
    return await QRCode.toDataURL(pixString, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#090A0C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Error generating Pix QR Code:', err);
    return '';
  }
}
