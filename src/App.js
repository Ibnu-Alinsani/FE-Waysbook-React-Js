import './App.css';
import * as ROUTER from "react-router-dom"
import * as PAGES from "./pages"
import * as PARTS from "./parts"
import * as IMG from "./assets"
import * as react from 'react';
import { UserContext } from './context';
import { API, setAuthToken } from './config/api';
import Swal from "sweetalert2";
import { Container } from 'react-bootstrap';
import { FallingLines } from 'react-loader-spinner';

function App() {
  const [state, dispatch] = react.useContext(UserContext)
  const [isLoading, setIsLoading] = react.useState(true) 

  react.useEffect(()=> {
    if (!isLoading) {
      if (state.isLogin === false) {
        <ROUTER.Navigate to="/" replace />
      }
    }
  }, [isLoading])

  react.useEffect(()=> {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
      checkUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  async function checkUser() {
    try {
      const response = await API.get("/check-auth")
      console.log("Check User Success")

      let payload = response.data.data
      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload,
      })

      setIsLoading(false)
    } catch (error) {
      console.log("Check User Failed : " , error)
      dispatch({
        type: "AUTH_ERROR",

      })
      setIsLoading(false)
    }
  }

  // private route
  function PrivateRouteAdmin(props) {
    if (props.login !== "admin" ) {
      Swal.fire({
        title: "You Don't have permission",
        text: `Please Call Admin `,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      return <ROUTER.Navigate to="/" replace />
    }

    return <ROUTER.Outlet/>
  }
  
  function PrivateRouteUser(props) {
    if (props.login !== "user") {
      Swal.fire({
        title: "Unauthorized",
        text: `Please Login, First`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      return <ROUTER.Navigate to="/" replace />
    }

    return <ROUTER.Outlet/>
  }

  return (
    <>
      {isLoading ? 
      (
          <Container fluid className=" text-center d-flex justify-content-center align-items-center" style={{height: "55vh"}}>
              <FallingLines
                  color="#242424"
                  width="100"
                  visible={true}
                  className="m-auto"
                  ariaLabel='falling-lines-loading'
              /> 
          </Container>
      ) : (
      <div style={{backgroundColor:"#e5e5e5 !important"}}>
        <div>
          <div>
          <ROUTER.BrowserRouter>
            <PARTS.Header />
            <ROUTER.Routes>

              <ROUTER.Route exact path="/" element={state.user.role === "admin" ? <PAGES.TableIncome/> : <PAGES.Home/>} />
              <ROUTER.Route exact path="/detail-book/:id" element={<PAGES.DetailBook/>}/>
              
              <ROUTER.Route exact path="/" element={<PrivateRouteAdmin login={state.user.role}/>}>
                <ROUTER.Route exact path="/table-income" element={<PAGES.TableIncome/>}/>
                <ROUTER.Route exact path="/income" element={<PAGES.Income/>}/>
                <ROUTER.Route exact path="/add-book" element={<PAGES.AddBook/>}/>
                <ROUTER.Route exact path="/update-book/:id" element={<PAGES.UpdateBook/>}/>
              </ROUTER.Route>
              
              <ROUTER.Route exact path='/' element={<PrivateRouteUser login={state.user.role}/>}>
                <ROUTER.Route exact path="/profile" element={<PAGES.Profile/>}/>
                <ROUTER.Route exact path="/cart" element={<PAGES.Cart/>}/>
              </ROUTER.Route>

            </ROUTER.Routes>
            <img src={IMG.Perintil} alt='...' className='position-absolute end-0 top-0' style={{zIndex:"-1"}}/>
            <img src={IMG.Perintil2} alt='...' className='position-absolute start-0 top-0' style={{zIndex:"-1"}}/>
          </ROUTER.BrowserRouter>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default App;
