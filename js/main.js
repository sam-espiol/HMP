/**
 * main.js
 * – Tạo hiệu ứng rơi (fallDown) cho tim và cánh hoa.
 * – Tự động play audio nền khi load trang (và fallback trên mobile).
 * – Rơi liên tục, dày đặc, không có điểm xuất phát cố định.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 main.js đã load – chuẩn bị hiệu ứng mưa petals & hearts và nhạc nền');

  // ===== 1. Phần thêm để play audio tự động =====
  // Tạo 1 thẻ <audio> động, hoặc bạn cũng có thể gắn sẵn <audio> trong HTML.
  const bgAudio = new Audio('music.mp3');
  bgAudio.loop = true;       // Phát lặp
  bgAudio.volume = 0.5;      // Điều chỉnh volume nếu cần
  bgAudio.play().catch(() => {
    // Nếu autoplay bị chặn (thường trên mobile), chờ đến khi user tương tác
    const resumeAudio = () => {
      bgAudio.play();
      document.body.removeEventListener('click', resumeAudio);
    };
    document.body.addEventListener('click', resumeAudio, { once: true });
  });

  // ===== 2. Hiệu ứng rơi petals & hearts =====
  const container = document.getElementById('floating-items');
  let maxItems = 200;         // Số phần tử tối đa cùng lúc
  let windowWidth = window.innerWidth;
  let currentCount = 0;      // Số item hiện tại

  // Cập nhật lại khi resize để left ngẫu nhiên luôn đúng khung
  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
  });

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createItem() {
    if (currentCount >= maxItems) return;

    const item = document.createElement('div');
    const isHeart = Math.random() < 0.5;
    item.classList.add('item', isHeart ? 'heart' : 'petal');

    const maxLeft = windowWidth - 20 - 4; // 4px đệm
    item.style.left = randomInt(0, Math.max(0, maxLeft)) + 'px';
    item.style.top = randomInt(-200, -20) + 'px';

    const duration = randomInt(4, 8);
    item.style.animationDuration = duration + 's';
    item.style.animationDelay = '0s';

    container.appendChild(item);
    currentCount++;

    const removeAfter = duration * 1000 + 200;
    let start = null;
    function tryRemove(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      if (elapsed >= removeAfter) {
        item.remove();
        currentCount--;
      } else {
        requestAnimationFrame(tryRemove);
      }
    }
    requestAnimationFrame(tryRemove);
  }

  setInterval(() => {
    if (currentCount < maxItems) {
      const toCreate = randomInt(3, 5);
      for (let i = 0; i < toCreate; i++) {
        if (currentCount < maxItems) createItem();
        else break;
      }
    }
  }, 100);
});
