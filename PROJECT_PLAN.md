# Kế hoạch dự án 20/10: HeartForGemus

## 1) Mục tiêu
- Tạo landing page quà 20/10 với **trái tim 3D dạng điểm ảnh**.
- Mỗi điểm ảnh (particle) có thể liên kết tới **ảnh cá nhân** (path cục bộ hoặc URL).
- Dùng cấu trúc **JavaScript động** để dễ thay dữ liệu người nhận mà không sửa logic render.

## 2) Phạm vi 5 ngày (chi phí = 0)
- **Ngày 1**: Dựng skeleton dự án tĩnh (HTML/CSS/JS), chọn renderer (Three.js), dựng scene/camera/light.
- **Ngày 2**: Render trái tim 3D bằng particle (Points/BufferGeometry), thêm xoay nhẹ + animation.
- **Ngày 3**: Thiết kế data-driven mapping `pointId -> imagePath`, hover/click hiện ảnh hoặc modal.
- **Ngày 4**: Tối ưu hiệu năng (số điểm, texture size), responsive mobile, preload ảnh, fallback ảnh lỗi.
- **Ngày 5**: Hoàn thiện UI/UX, kiểm thử thủ công, đóng gói deploy miễn phí (GitHub Pages/Netlify).

## 3) Kiến trúc JavaScript động (đề xuất)
```txt
src/
  data/
    recipients.js      # Danh sách người + path ảnh
    heartMap.js        # Mapping particleIndex -> recipientId
  core/
    scene.js           # Khởi tạo renderer/camera/loop
    heartParticles.js  # Tạo geometry điểm ảnh trái tim
    interactions.js    # Raycast hover/click vào particle
  ui/
    modal.js           # Hiển thị ảnh + tên
  main.js              # Entry point
```

### Mẫu dữ liệu
```js
// recipients.js
export const recipients = [
  { id: "p01", name: "A", imagePath: "/assets/photos/a.jpg" },
  { id: "p02", name: "B", imagePath: "/assets/photos/b.jpg" }
];

// heartMap.js
export const heartMap = {
  0: "p01",
  1: "p02"
};
```

## 4) Dự án tham khảo
- https://github.com/NamPE286/threejs-heart-particles
- https://github.com/thanhzkda/Valentine-Demo
- https://github.com/wulfdesign/valentines-heart
- https://github.com/Arya-devOps10/react-three-fiber-heart
- https://github.com/Veba-n/parametric-heart-particles

> Gợi ý thực tế: ưu tiên bắt đầu từ dự án Three.js thuần để giảm độ phức tạp, sau đó mới nâng cấp React Three Fiber nếu còn thời gian.
