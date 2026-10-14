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

## 5) Hướng MVP hiện tại — khám phá trái tim trước

- QR chung mở thẳng trái tim hạt sáng tông ấm; không yêu cầu chọn tên trước.
- Hạt nền tạo hình tim; mỗi thành viên có một đốm sáng lớn và nhãn tên trên bề mặt.
- Vuốt/kéo để xoay, chụm hai ngón hoặc cuộn chuột để zoom; có nút +/− và đặt lại góc nhìn.
- Chạm tên mở thẳng thiệp toàn màn hình, có ảnh tách nền, lời chúc chung và lời nhắn riêng. Đóng thiệp quay lại góc nhìn/zoom trước đó.
- Nút tìm nhanh mở danh sách tên như lối phụ; người xem có thể mở thiệp của bất kỳ tên nào. Hướng này thay thế lựa chọn chỉ xem thiệp của mình trước đó.
- Hiện dùng 33 ảnh thật trong `members.json`; tên có dấu và lời nhắn riêng chờ hoàn thiện. Đã triển khai GitHub Pages tại https://ntbao-coder.github.io/HeartForGemus/; chưa tạo QR.
- Đã kiểm tra cú pháp JS, luồng chọn tên/mở/đóng thiệp bằng DOM mô phỏng, cùng thao tác chạm/kéo/pinch và giới hạn zoom bằng kiểm tra sự kiện. Chưa kiểm tra trực quan trên điện thoại thật.

### Giai đoạn thử mật độ 25 người (đã thay bằng 33 người)
- Bộ xem thử có 25 ID/tên minh họa, dùng lặp ảnh có sẵn; chưa gán tên thật.
- Tăng diện tích cảnh tim và đưa camera gần hơn; vị trí thành viên phân bố trên cả bề mặt, ổn định giữa các lần tải.
- Sắp xếp nhãn theo tọa độ màn hình, tránh chồng tên/vùng chạm 44px; ưu tiên đốm đang tìm, phần phía sau không nhận chạm. Khi quá sát nhau, ẩn bớt điểm tương tác; xoay/zoom hoặc tìm nhanh để tiếp cận.
- Tìm nhanh đưa đốm sáng ra phía trước, làm nổi bật, rồi chạm mở thiệp.
- `node heart-2010/tests/layout.test.cjs` kiểm tra 25 điểm ở 4 viewport × 4 mức zoom. Đã qua kiểm tra tài nguyên, luồng thiệp và sự kiện zoom/kéo mô phỏng; chưa xác nhận trực quan trên thiết bị thật.

### Cập nhật bộ ảnh thật (14/10)
- Thay bộ preview 25 người bằng 33 mục trong `members.json`, không lặp ảnh.
- Tên tạm lấy từ tên file; lời nhắn riêng để trống chờ người dùng soạn, giao diện ẩn phần này khi chưa có nội dung.
- Ảnh mới đã được tạo bản nhẹ và thumbnail ở `assets/members`; giữ nguyên toàn bộ ảnh gốc.
- Loại bỏ `members-preview.json` và `assets/preview`. Kiểm tra bố trí đã nâng lên 33 điểm.
