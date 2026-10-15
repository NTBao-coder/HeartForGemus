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

## Tiếp tục trên máy khác

Website đang hoạt động: https://ntbao-coder.github.io/HeartForGemus/

```sh
git clone https://github.com/NTBao-coder/HeartForGemus.git
cd HeartForGemus
python3 -m http.server 4173 --directory heart-2010
```

Mở http://localhost:4173. Nếu đã clone trước đó, dùng `git pull --ff-only origin main` khi không có thay đổi cục bộ chưa lưu. Không cần npm install; Node.js chỉ cần để chạy các bài kiểm tra.

Công việc tiếp theo:

1. Điền tên đúng theo ảnh trong [Ten.md](./Ten.md), rồi cập nhật trường `name` trong `heart-2010/members.json`.
2. Soạn lời chúc riêng vào trường `wish` của từng người.
3. Kiểm tra xoay, zoom và mở thiệp trên điện thoại thật, sau đó tạo QR từ link công khai ở trên.

Ảnh tối ưu đã được lưu trong Git, máy khác có thể chạy web ngay. Script đồng bộ ảnh dùng `sips` của macOS; Windows/Linux vẫn chạy web và sửa tên/lời chúc bình thường, nhưng cần thay công cụ xử lý ảnh nếu muốn chạy lại script.

GitHub Pages tự triển khai khi push nhánh `main`. Nếu tab còn hiển thị bản cũ, tải lại trang. Đã xác nhận trực tiếp trên Safari: danh sách 33 người và thiệp An Tran dùng ảnh mới; kiểm tra toàn diện trên điện thoại vẫn còn cần thực hiện.

## Gradient theo ảnh thành viên

Mỗi thiệp dùng hai màu pastel lấy sẵn từ ảnh, với vùng nội dung màu sáng cố định để chữ luôn rõ. Sau khi cập nhật ảnh, chạy `python3 heart-2010/scripts/sync-palettes.py` (cần Pillow: `python3 -m pip install Pillow`). Màu được lưu trong trường `palette` của `members.json`; trang không phải phân tích ảnh khi mở thiệp. Nếu thiếu palette, trang dùng màu Gemus mặc định.
