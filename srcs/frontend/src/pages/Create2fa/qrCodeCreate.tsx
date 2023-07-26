import { useEffect, useState } from 'react';
import axios from 'axios';

const QRCodeImage = () => {
  const [qrCode, setQRCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await  axios.get('http://localhost:3001/auth/enable2fa', {
            withCredentials:true,
          responseType: 'arraybuffer',
        });

        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        setQRCode(imageUrl);
      } catch (error) {
        console.error('QR code fetch error:', error);
        // Hata durumunda gerekli işlemleri yapabilirsiniz
      }
    };

    fetchQRCode();
  }, []);

  //TODO backend fix!!!!
  return <img src={qrCode || ''} alt="QR Code" className='QRimage' />;
};

export default QRCodeImage;
