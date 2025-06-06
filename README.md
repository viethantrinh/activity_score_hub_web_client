# Hệ thống quản lý sự kiện - Activity Score Hub

## Tổng quan dự án

Hệ thống quản lý sự kiện là một ứng dụng web được xây dựng bằng Angular 18, cho phép quản lý các hoạt động, người dùng, vai trò và điểm số trong các sự kiện giáo dục.

## Tính năng đã hoàn thành

### 🔐 Hệ thống xác thực
- ✅ Đăng nhập với username/password
- ✅ Đăng ký tài khoản mới
- ✅ Phân quyền theo vai trò (Admin/Teacher)
- ✅ Bảo mật route theo vai trò
- ✅ Quản lý session với localStorage

### 👥 Quản lý người dùng (Admin)
- ✅ Danh sách người dùng với tìm kiếm và lọc
- ✅ Thêm người dùng mới
- ✅ Chỉnh sửa thông tin người dùng
- ✅ Xóa người dùng
- ✅ Kích hoạt/vô hiệu hóa tài khoản
- ✅ Xuất danh sách ra Excel

### 🎯 Quản lý hoạt động (Admin)
- ✅ Danh sách hoạt động với tìm kiếm
- ✅ Hiển thị dạng card với thông tin chi tiết
- ✅ Xóa hoạt động
- ✅ Xuất danh sách ra Excel
- 🔄 Thêm/sửa hoạt động (placeholder)
- 🔄 Quản lý vai trò trong hoạt động (placeholder)

### 🏷️ Quản lý vai trò (Admin)
- ✅ Danh sách vai trò với tìm kiếm
- ✅ Hiển thị số lần sử dụng
- ✅ Xóa vai trò (chỉ khi không được sử dụng)
- ✅ Xuất danh sách ra Excel
- 🔄 Thêm/sửa vai trò (placeholder)

### 📊 Dashboard
- ✅ **Admin Dashboard**: Thống kê tổng quan, biểu đồ, hoạt động gần đây
- ✅ **Teacher Dashboard**: Thống kê cá nhân, điểm số, hoạt động của giáo viên

### 🎨 Giao diện người dùng
- ✅ Responsive design với Bootstrap 5
- ✅ Dark/Light theme support
- ✅ Sidebar navigation có thể thu gọn
- ✅ Professional animations và hover effects
- ✅ Font Awesome icons
- ✅ Loading states và error handling

### 🔧 Kiến trúc kỹ thuật
- ✅ Angular 18 với Standalone Components
- ✅ TypeScript với strict mode
- ✅ RxJS cho reactive programming
- ✅ Services với mock data
- ✅ Form validation với Reactive Forms
- ✅ Route guards và lazy loading ready

## Cấu trúc dự án

```
src/
├── app/
│   ├── core/                    # Core modules
│   │   ├── auth/               # Authentication models & guards
│   │   └── services/           # Business logic services
│   ├── feature/                # Feature modules
│   │   ├── admin/              # Admin features
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── users/          # User management
│   │   │   ├── activities/     # Activity management
│   │   │   └── roles/          # Role management
│   │   ├── teacher/            # Teacher features
│   │   └── auth/               # Authentication pages
│   ├── shared/                 # Shared components
│   │   └── components/         # Reusable components
│   └── styles/                 # Global styles
```

## Tài khoản demo

### Admin
- **Username**: admin
- **Password**: admin123

### Teacher
- **Username**: teacher1
- **Password**: teacher123

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+
- Angular CLI 18+

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd activity_score_hub_web_client

# Cài đặt dependencies
npm install

# Chạy development server
ng serve

# Mở trình duyệt tại http://localhost:4200
```

### Build production
```bash
ng build --prod
```

## Tính năng sẽ phát triển

### 🔄 Đang phát triển
- Form thêm/sửa hoạt động
- Form thêm/sửa vai trò
- Quản lý điểm số chi tiết
- Quản lý hoạt động của giáo viên
- Hệ thống báo cáo nâng cao

### 📋 Kế hoạch tương lai
- Tích hợp backend API
- Hệ thống thông báo real-time
- Upload file và quản lý tài liệu
- Xuất báo cáo PDF
- Mobile app
- Multi-language support

## Công nghệ sử dụng

- **Frontend**: Angular 18, TypeScript, RxJS
- **UI Framework**: Bootstrap 5, Font Awesome
- **Build Tool**: Angular CLI, Webpack
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- **Developer**: Việt Hân Trịnh
- **Email**: [your-email@example.com]
- **Project Link**: [https://github.com/your-username/activity-score-hub]

---

*Dự án được phát triển với ❤️ bằng Angular 18*
