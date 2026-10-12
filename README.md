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
- `heart-2010/site-config.json` chọn file dữ liệu. Bản xem thử dùng `members-preview.json` với 25 tên/lời nhắn minh họa và ảnh PNG hiện có được dùng lặp để kiểm tra mật độ. Chưa gán ảnh vào tên thật.
- Khi đã cập nhật đúng ảnh, tên và lời nhắn trong `members.json`, đổi `membersFile` thành `members.json` và `preview` thành `false`.
- Ảnh gốc giữ trong `avatars/`; bản giảm kích thước và thumbnail giữ trong `assets/preview/`, vẫn giữ nền trong suốt.
- Trang cần mạng để tải Three.js và font; nếu không có WebGL/Three.js, dùng hình tim tĩnh. Thiệp vẫn mở được.
- QR chung và chọn tên không xác thực danh tính. Bất kỳ ai cũng có thể chạm một tên để xem thiệp tương ứng; dữ liệu thiệp trong website tĩnh không phải dữ liệu riêng tư được bảo vệ.

Kiểm tra bố trí nhãn: `node heart-2010/tests/layout.test.cjs`. Tìm nhanh sẽ đưa đốm sáng ra trước để chạm mở thiệp.
