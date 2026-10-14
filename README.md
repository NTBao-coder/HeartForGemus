# HeartForGemus
Một món quà dành tặng cho các cô gái của Đội văn nghệ xung kích trường KHTN 

## Kế hoạch triển khai
Xem file kế hoạch tại: [PROJECT_PLAN.md](./PROJECT_PLAN.md)

## Xem thử MVP

Chạy từ thư mục dự án:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory heart-2010
```

Mở http://127.0.0.1:4173 trong trình duyệt. Đây là địa chỉ trên máy tính đang chạy server, chưa phải link công khai để tạo QR.

- Luồng: trái tim ánh sáng → xoay/zoom tìm đốm sáng có tên → chạm mở thiệp → quay lại trái tim. Có danh sách tìm tên làm lối phụ.
- `heart-2010/site-config.json` dùng `members.json` với 33 ảnh mới, mỗi ảnh ứng với một thành viên.
- Tên hiển thị tạm lấy từ tên file (không tự đoán dấu tiếng Việt). Sửa `name` và `wish` trong `members.json` để hoàn thiện nội dung; khi `wish` trống, thiệp chỉ hiển thị lời chúc chung.
- Ảnh gốc giữ trong `avatars/`; bản giảm kích thước và thumbnail ở `assets/members/`. `sourceAvatar` ghi rõ ảnh gốc tương ứng. Đã bỏ bộ ảnh và dữ liệu preview cũ.
- Trang cần mạng để tải Three.js và font; nếu không có WebGL/Three.js, dùng hình tim tĩnh. Thiệp vẫn mở được.
- QR chung và chọn tên không xác thực danh tính. Bất kỳ ai cũng có thể chạm một tên để xem thiệp tương ứng; dữ liệu thiệp trong website tĩnh không phải dữ liệu riêng tư được bảo vệ.

Kiểm tra bố trí nhãn: `node heart-2010/tests/layout.test.cjs`. Tìm nhanh sẽ đưa đốm sáng ra trước để chạm mở thiệp.

## Cập nhật ảnh và danh sách

Sau khi thay ảnh trong `heart-2010/avatars`, chạy trên macOS:

```sh
python3 heart-2010/scripts/sync-members.py
node heart-2010/tests/members.test.cjs
node heart-2010/tests/layout.test.cjs
```

Script giữ tên/lời chúc đã sửa cho cùng file nguồn, tạo ảnh tối ưu có mã phiên bản theo nội dung và đồng bộ thêm/bớt ảnh. Chỉnh tên có dấu và lời chúc tại `members.json`. Đổi tên file nguồn được xem là một thành viên mới.
