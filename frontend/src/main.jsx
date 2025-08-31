import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import './tailwind-output.css';
import App from './App.jsx'
import Root from './components/Root.jsx';
import Login from './components/aute/Login.jsx';
import Student from './components/students/Student.jsx'
import Dashboard from './components/students/Dashboard.jsx'
import Registeraldashboard from './components/registeral/Registeraldashboard.jsx';
import Registration from './components/registeral/Registration.jsx';
import Changepassword from './components/aute/Cangepassword.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import DepartmentDashboard from './components/departments/DepartmentDashboard.jsx'
import StudentProfile from './components/students/StudentProfile.jsx';
import GradeCard from './components/students/GradeCard.jsx';
import PrivateRoute from './components/aute/PrivateRoute.jsx';
import Unauthorized from './components/comman/Unauthorized.jsx';
import { AuthProvider } from './components/aute/AuthContext.jsx';
import Grade from './components/students/Grade.jsx';
import PublicRoute from './components/aute/Publicroute.jsx';
import TrackerLayout from './components/aute/TrackerLayout.jsx';
import BiografyEdit from './components/registeral/BiografyEdit.jsx'
import UseBiography from './components/admin/UseBiography.jsx'
import MyBiography from './components/students/MyBiography.jsx';
import AddCourse from './components/departments/AddCourse.jsx'
import CourseList from './components/departments/CourseList.jsx';
import AddCourses from './components/admin/AddCourses.jsx';
import AllCourseList from './components/admin/AllCoursesList.jsx';
import AddDepartments from './components/admin/AddDepartments.jsx';
import AddCollages from './components/admin/AddCollages.jsx';
import CollegeList from './components/admin/CollageList.jsx';
import DepartmentList from './components/admin/DepartmentList.jsx';
import UserRegistration from './components/admin/UserRegistration.jsx'
import AllUsersList from './components/admin/AllUsersList.jsx';
import RegularRegistration from './components/registeral/RegularRegistration.jsx'
import RegisteredStudent from './components/registeral/RegisteredStudent.jsx'
import UserManagement from './components/admin/UserManagement.jsx'
import UserPasswordReset from './components/admin/UserPasswordReset.jsx'

const router=createBrowserRouter([

   /////////Super Public Route/////////////     
   {
             path:'/',
             element:<Root/>,
             children:[
            {
            index:true,
            element:<App/>,
            },

            {
              path:'biography-edit',
              element:<BiografyEdit/>
            }
             ]
            
      },
      // {
      //    path:'/user-biography/:userId',
      //    element:<UseBiography/>
      // },

    
  /////////Public Route///////////// 

  {
  element:<TrackerLayout/>,
  children:[
  {
     path:'/',
    element:<PublicRoute/>,
    children:[
     
      {
        path:'/login',
        element: <Login/>
      },
    ]
  },
 
     
    {
        path: "/unauthorized",
        element: <Unauthorized />,
    },

     {
       element:<PrivateRoute/>,
       children:
       [
        {
          path:'change-password',
          element:<Changepassword/>
        },
       ]
     },
    {
        element: <PrivateRoute allowedRoles={["student"]} />,
        children: [
            {
              path:'student',
              element:<Student/>,
            },
        ],
    },

    {
        element: <PrivateRoute allowedRoles={["student"]} />,
        children: [
               {
          path:'studentdashboard',
          element:<Dashboard/>,
          children:[
            {
          path:'student-profile',
          element:<StudentProfile/>
          },
          {
           path: 'my-biography',
           element:<MyBiography/>
          },
          {
          path:'student-grade',
          element:<GradeCard/>,
          children:[
             {
              path:'grade-list',
              element:<Grade/>,
             },
          ]
          },
          ]
        },
        ],
    },
    {
        element: <PrivateRoute allowedRoles={["registeral"]} />,
        children: [
                {
                   path:'/user-biography/:username',
                   element:<UseBiography/>
              },
              {
          path:'registeraldashboard',
          element:<Registeraldashboard/>,
          children:[
            {
              path:'registration/freshman',
              element:<Registration/>
            },
             {
              path:'registration',
              element:<RegularRegistration/>
            },
            {
              path:'registratered/student',
              element:<RegisteredStudent/>
            },
              {
              path:'biography-edit',
              element:<BiografyEdit/>,
              
            },
          
          ]
          
        },
        ],
    },
    
      {
        element: <PrivateRoute allowedRoles={["admin"]} />,
        children: [
              {
          path:'admindashboard',
          element:<AdminDashboard/>,
          children:[
            {
              path:'userregistration',
              element:<UserRegistration/>
            },
            {
              path:'addcourse',
              element:<AddCourses/>
            },
            {
              path:'courseslist',
              element:<AllCourseList/>
            },
            {
              path:'add-departmrnt',
              element:<AddDepartments/>
            },
            {
              path:'add-collage',
              element:<AddCollages/>
            },
            {
              path:'collages-list',
              element:<CollegeList/>
            },
            {
              path:'departments-list',
              element:<DepartmentList/>
            },
            {
              path:'users-list',
              element:<AllUsersList/>
            },
            {
              path:'usermanagement',
              element:<UserManagement/>
            },
            {
              path:'password-reset',
              element:<UserPasswordReset/>
            }
          ]
        },
        ],
    },

         {
        element: <PrivateRoute allowedRoles={["department"]} />,
        children: [
              {
          path:'departmentdashboard',
          element:<DepartmentDashboard/>,
          children:[
            {
             path:'addcourse',
             element:<AddCourse/>
            },
            {
              path:'courselist',
              element:<CourseList/>
            }
          ]
        },
        ],
    },]},

  // {
  //   path:'/',
  //   element:<Root/>,
  //   children:[
  //     {
  //       index:true,
  //       element:<App/>
  //     },
    
  //   ]
  // },
  //   {
  //       path:'login',
  //       element:<Login/>
  //     },
    
  //   {
  //     path:'student',
  //     element:<Student/>,
  //   },
   
  //     {
  //         path:'studentdashboard',
  //         element:<Dashboard/>,
  //         children:[
  //           {
  //         path:'student-profile',
  //         element:<StudentProfile/>
  //         },
  //         {
  //         path:'student-grade',
  //         element:<Mainbar/>
  //         },
  //         ]
  //       },

  //       {
  //         path:'registeraldashboard',
  //         element:<Registeraldashboard/>,
  //         children:[
  //           {
  //             path:'registration',
  //             element:<Registration/>
  //           }
  //         ]
  //       },
        // {
        //   path:'change-password',
        //   element:<Changepassword/>
        // },

        // {
        //   path:'admindashboard',
        //   element:<AdminDashboard/>
        // },

        // {
        //   path:'departmentdashboard',
        //   element:<DepartmentDashboard/>
        // }



])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider><RouterProvider router={router}/></AuthProvider>
  </StrictMode>,
)
