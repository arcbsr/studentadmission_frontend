# RNBRIDGE Ltd - Student Admission Management System

A comprehensive web application for managing international student admissions, agent networks, and university partnerships.

## 🚀 Features

### Public Features
- **Homepage**: Landing page with company information and call-to-action
- **Universities**: Browse partner universities with search and filtering
- **About Us**: Company information and services
- **Contact**: Contact information and inquiry form
- **Student Inquiry Form**: Apply for admission with agent referral support

### Agent Features
- **Agent Registration**: Sign up as an agent with unique referral key
- **Agent Dashboard**: Track referrals, commissions, and performance
- **Referral Management**: View all student referrals and their status

### Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **University Management**: Add, edit, disable universities
- **Student Inquiries**: View and manage all student applications
- **Agent Management**: Monitor agents, set commissions, enable/disable
- **Company Profile**: Update company information
- **Analytics**: Overview of system performance and statistics

## 🔐 Admin Access

### Super Admin Configuration
The super admin credentials are configured via environment variables:

```bash
REACT_APP_SUPER_ADMIN_EMAIL=your_super_admin_email@example.com
REACT_APP_SUPER_ADMIN_PASSWORD=your_super_admin_password_here
```

**Note**: If environment variables are not set, the system will use default credentials for initialization only. For production, always set these environment variables.

### User Roles & Permissions

#### **Super Admin** (`super_admin`)
- Full system access
- User management capabilities
- All admin permissions
- System settings access
- Cannot be modified or deleted

#### **Admin** (`admin`)
- University management
- Student inquiry management
- Agent management
- Company profile management
- Analytics access

#### **Agent** (`agent`)
- View own referrals
- Track own commissions
- Limited dashboard access

### Super Admin Capabilities
1. **User Management**
   - Create, edit, and delete users
   - Assign roles and permissions
   - Enable/disable user accounts
   - Monitor user activity

2. **University Management**
   - Add new universities with details (name, country, location, rating, etc.)
   - Edit existing university information
   - Enable/disable universities
   - Delete universities

3. **Student Inquiry Management**
   - View all student inquiries
   - Update inquiry status (pending, admitted, rejected)
   - Track agent referrals
   - Monitor application progress

4. **Agent Management**
   - View all registered agents
   - Set commission rates per referral
   - Enable/disable agents
   - Monitor agent performance and referrals

5. **Company Profile Management**
   - Update company information
   - Modify contact details
   - Change business hours and location

6. **System Settings**
   - Configure system-wide settings
   - Manage permissions
   - System analytics

## 🛠️ Technical Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🔧 Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend_firebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your credentials:
   ```bash
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # EmailJS Configuration
   REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
   REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   
   # Super Admin Configuration
   REACT_APP_SUPER_ADMIN_EMAIL=your_super_admin_email@example.com
   REACT_APP_SUPER_ADMIN_PASSWORD=your_super_admin_password_here
   ```

4. **Configure EmailJS (Optional but Recommended)**
   
   For email notifications to work, set up EmailJS:
   
   a. Sign up at https://www.emailjs.com/
   b. Create an Email Service (Gmail, Outlook, etc.)
   c. Create an Email Template with these variables:
      - `to_email` - Recipient email
      - `to_name` - Recipient name
      - `from_name` - Sender name
      - `from_email` - Sender email
      - `subject` - Email subject
      - `message` - Email content
   d. Copy your Service ID, Template ID, and User ID to the environment variables above

5. **Start development server**
   ```bash
   npm start
   ```

### Production Build
```bash
npm run build
```

The build folder will be created with optimized production files.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── firebase/           # Firebase configuration
├── pages/              # Page components
├── utils/              # Utility functions
└── App.js              # Main application component
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Update `src/firebase/config.js` with your Firebase credentials
   - Set up Firebase Realtime Database rules

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access Admin Panel**
   - Go to `/admin/login`
   - Use the credentials configured in your environment variables

## 🔥 Firebase Database Rules

```json
{
  "rules": {
    "test-connection": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "inquiries": {
      ".read": "auth != null",
      ".write": true
    },
    "agents": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "universities": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "company": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

## 📧 Email Features

The system includes comprehensive email notifications:

### **Student Notifications**
- **Inquiry Confirmation**: Students receive confirmation emails when they submit inquiries
- **Status Updates**: Students are notified when their application status changes (pending → admitted/rejected)

### **Agent Notifications**
- **Welcome Email**: New agents receive welcome emails with their referral key and commission rate
- **Referral Notifications**: Agents are notified when students use their referral key

### **Admin Notifications**
- **New Inquiry Alerts**: Admins receive notifications for all new student inquiries
- **System Updates**: Important system changes trigger admin notifications

### **Email Setup**
To enable email functionality:
1. Sign up for EmailJS (https://www.emailjs.com/)
2. Configure your email service (Gmail, Outlook, etc.)
3. Create email templates with the required variables
4. Add your EmailJS credentials to environment variables

## 📊 Admin Dashboard Features

### Overview Tab
- Total inquiries count
- Pending inquiries
- Active agents count
- Universities count
- Recent inquiries list
- Top performing agents

### Student Inquiries Tab
- Complete list of all student applications
- Filter by status (pending, admitted, rejected)
- Update application status
- Automatic email notifications on status changes
- View agent referrals
- Application dates and details

### Agents Tab
- List all registered agents
- Set commission rates
- Enable/disable agents
- Track agent performance
- View referral counts

### Universities Tab
- Add new universities
- Edit university details
- Enable/disable universities
- Delete universities
- University ratings and information

### User Management Tab (Super Admin Only)
- Manage all system users
- Assign roles and permissions
- Enable/disable user accounts
- Monitor user activity
- User role management

### Company Profile Tab
- Update company information
- Modify contact details
- Change business information
- Real-time updates

## 🔧 Development Notes

- The default admin user is automatically created when the app starts
- All data is stored in Firebase Realtime Database
- Real-time updates for all dashboard components
- Responsive design for mobile and desktop
- Form validation using React Hook Form
- Toast notifications for user feedback

## 📞 Support

For technical support or questions about the admin functionality, please contact the development team. 