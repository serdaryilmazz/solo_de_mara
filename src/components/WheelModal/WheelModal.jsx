import { useState, useEffect, useRef, useTransition } from 'react';
import confetti from 'canvas-confetti';
import { getImagePath } from '../../utils/imageMap';
import styles from './WheelModal.module.css';

// Colors for wheel slices
const SLICE_COLORS = [
  '#23463E', // Emerald
  '#2A1E16', // Dark Brown
  '#A54A2A', // Terracotta
  '#3D2E1E', // Warm Charcoal
  '#1E3630', // Deep Jade
  '#4A2318', // Deep Crimson
  '#2C2219', // Espresso
  '#7A351D', // Rust
];

function WheelModal({ isOpen, onClose, items }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const canvasRef = useRef(null);

  // Keep track of current wheel angle in radians
  const currentAngleRef = useRef(0);
  const animationFrameRef = useRef(null);

  const numItems = items.length;

  /**
   * Draw the wheel on the canvas
   */
  const drawWheel = (angle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || numItems === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;
    const sliceAngle = (2 * Math.PI) / numItems;

    ctx.clearRect(0, 0, width, height);

    // Outer glowing border
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1A140E';
    ctx.shadowColor = '#C99842';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Draw Slices
    for (let i = 0; i < numItems; i++) {
      const startAngle = angle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
      ctx.fill();

      // Slice border (Gold thread)
      ctx.strokeStyle = 'rgba(201, 152, 66, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text inside slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#F4E8D2';
      ctx.font = '600 14px "Playfair Display", Georgia, serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;

      // Truncate name if too long for slice
      let name = items[i].name;
      if (name.length > 14) name = name.substring(0, 12) + '...';
      ctx.fillText(name, radius - 24, 5);
      ctx.restore();
    }

    // Outer Gold Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#C99842';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Center Hub (Sun Button)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#241A12';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.strokeStyle = '#C99842';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sun Icon / Text in Center Hub
    ctx.fillStyle = '#C99842';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☀', centerX, centerY);
    ctx.restore();
  };

  // Redraw when modal opens or items change
  useEffect(() => {
    if (isOpen) {
      setShowResult(false);
      setSelectedItem(null);
      setIsSpinning(false);
      // Wait for DOM to render canvas size
      setTimeout(() => drawWheel(currentAngleRef.current), 50);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isOpen, items]);

  /**
   * Launch fireworks celebration!
   */
  const triggerFireworks = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Initial burst
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#C99842', '#D4AB5E', '#A54A2A', '#23463E', '#F4E8D2'],
    });

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Side cannons
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#C99842', '#D4AB5E', '#F4E8D2'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#A54A2A', '#23463E', '#C99842'],
      });
    }, 250);
  };

  /**
   * Spin the Wheel logic
   */
  const spinWheel = () => {
    if (isSpinning || numItems === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedItem(null);

    // Pick random winning item index
    const winningIndex = Math.floor(Math.random() * numItems);
    const winningItem = items[winningIndex];

    // Pointer is at TOP (270 degrees / 1.5 * PI in canvas coordinate, or -PI/2)
    // Slice angle = 2 * PI / numItems
    // Target angle where pointer points to winning index
    const sliceAngle = (2 * Math.PI) / numItems;
    const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
    
    // Pointer is at top (- Math.PI / 2)
    // Canvas rotation formula: (pointerAngle - targetSliceCenter)
    const pointerAngle = -Math.PI / 2;
    let targetAngle = pointerAngle - targetSliceCenter;

    // Add 5 to 8 full rotations for cinematic spin
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;

    // Normalize current angle so it spins forward smoothly
    const startAngle = currentAngleRef.current;
    // Calculate total delta angle
    const targetTotalAngle = startAngle + extraTurns + ((targetAngle - (startAngle % (2 * Math.PI)) + 4 * Math.PI) % (2 * Math.PI));

    const startTime = performance.now();
    const duration = 4000; // 4 seconds total spin time

    // Custom cubic-bezier deceleration
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentAngle = startAngle + (targetTotalAngle - startAngle) * easedProgress;
      currentAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin complete!
        setIsSpinning(false);
        setSelectedItem(winningItem);
        setShowResult(true);
        triggerFireworks();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Kapat"
          type="button"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className={styles.header}>
          <span className={styles.subTitle}>Sol de Mara Lezzet Çarkı</span>
          <h2 className={styles.title}>🎲 Bugün Ne Yesem?</h2>
          <p className={styles.description}>
            Kararsız mı kaldınız? Çarkı çevirin, bugünkü şanslı lezzetinizi keşfedin!
          </p>
        </div>

        {/* Wheel Container */}
        <div className={styles.wheelContainer}>
          {/* Top Gold Pointer Arrow */}
          <div className={styles.pointer} />

          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className={styles.canvas}
          />
        </div>

        {/* Spin Action Button */}
        {!showResult && (
          <button
            className={styles.spinBtn}
            onClick={spinWheel}
            disabled={isSpinning}
            type="button"
          >
            {isSpinning ? 'Dönüyor...' : '✨ Çarkı Çevir! ✨'}
          </button>
        )}

        {/* Result Card Modal Overlay */}
        {showResult && selectedItem && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultCard}>
              <div className={styles.resultBadge}>🎉 Bugünkü Seçiminiz!</div>

              <div className={styles.resultImageWrapper}>
                <img
                  src={getImagePath(selectedItem.image)}
                  alt={selectedItem.name}
                  className={styles.resultImage}
                />
              </div>

              <h3 className={styles.resultName}>{selectedItem.name}</h3>

              {selectedItem.subtitle && (
                <span className={styles.resultSubtitle}>{selectedItem.subtitle}</span>
              )}

              {selectedItem.description && (
                <p className={styles.resultDescription}>{selectedItem.description}</p>
              )}

              <div className={styles.resultPrice}>{selectedItem.price} TL</div>

              <div className={styles.resultActions}>
                <button
                  className={styles.respinBtn}
                  onClick={spinWheel}
                  type="button"
                >
                  🔄 Tekrar Çevir
                </button>
                <button
                  className={styles.acceptBtn}
                  onClick={onClose}
                  type="button"
                >
                  Afiyet Olsun! 😋
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WheelModal;
