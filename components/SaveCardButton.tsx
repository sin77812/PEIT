'use client';

interface SaveCardButtonProps {
  typeCode: string;
  name: string;
  category: 'political' | 'economic';
  imageSrc: string;
  label?: string;
  className?: string;
}

export default function SaveCardButton({ typeCode, name, category, imageSrc, label = '카드 저장하기', className = '' }: SaveCardButtonProps) {
  const handleSave = async () => {
    const width = 1080; // square card
    const height = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // background
    ctx.fillStyle = '#FAF7FF';
    ctx.fillRect(0, 0, width, height);

    // card white panel
    const pad = 48;
    const panelRadius = 28;
    const panelX = pad;
    const panelY = pad + 40;
    const panelW = width - pad * 2;
    const panelH = height - pad * 2 - 40;
    roundRect(ctx, panelX, panelY, panelW, panelH, panelRadius);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#7C3AED'; // accent
    ctx.stroke();

    // header text
    ctx.fillStyle = '#7C3AED';
    ctx.font = 'bold 56px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(category === 'political' ? '정치 성향' : '경제 성향', width / 2, panelY + 72);

    // draw image (centered)
    const img = new Image();
    img.onload = () => {
      const imgSize = 360;
      const imgX = width / 2 - imgSize / 2;
      const imgY = panelY + 110;
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

      // type code
      ctx.fillStyle = '#7C3AED';
      ctx.font = 'bold 72px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.fillText(typeCode, width / 2, imgY + imgSize + 90);

      // name
      ctx.fillStyle = '#111827';
      ctx.font = '500 36px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.fillText(name, width / 2, imgY + imgSize + 140);

      // footer
      ctx.fillStyle = '#6B7280';
      ctx.font = '500 28px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.fillText('peit.kr', width / 2, panelY + panelH - 36);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `PEIT_${category}_${typeCode}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    img.src = imageSrc;
  };

  return (
    <button
      onClick={handleSave}
      className={`px-6 py-3 font-semibold rounded-xl transition-all ${className}`}
    >
      저장하기
    </button>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
