import * as react from "react"
import { Button, Container, NavDropdown, Navbar } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import * as IMG from "../../assets"
import * as COMP from "../../component"
import { UserContext } from "../../context"
import { useQuery } from "react-query"
import { API } from "../../config/api"

function Header() {
    const [state, dispatch] = react.useContext(UserContext)
    const [modalShow, setModalShow] = react.useState(false) 
    const [modalShowRegister, setModalShowRegister] = react.useState(false) 
    
    react.useEffect(() => {
        let dropdownAvatar = document.getElementById("collasible-nav-dropdown");
        if (dropdownAvatar != null) {
            dropdownAvatar.innerHTML = `<img src="${state.user.avatar !== "" ? state.user.avatar : (state.user.gender === "male" ? IMG.Male : IMG.Female)}" alt="..." width="60px" height="60px" className="object-fit-contain"/>`
            dropdownAvatar.style.objectFit = "contain"
        }
    }, [state]);
    const {data : user} = useQuery("cartCache", async () => {
        const response = await API.get(`/user/${state.user.id}`)
        return response.data.data
    }, {refetchOnMount: true})

    const [qty, setQty] = react.useState(0);

    react.useEffect(() => {
        if (user?.cart_item) {
        setQty(user.cart_item.length);
        } else {
        setQty(0);
        }
    }, [user?.cart_item]);

    let navigate = useNavigate()
    const Logout = () => {
        dispatch({
            type: "LOGOUT",
        })

        navigate("/")
    }

    return(
        <div className="mt-3">
            <Navbar bg="transparent">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                        alt=""
                        src={IMG.Logo}
                        width="116"
                        height="65"
                        className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    {state.user.role === "admin" ? 
                    <NavDropdown id="collasible-nav-dropdown" align="end">
                        <NavDropdown.Item as={Link} to="/add-book">
                            <img src={IMG.Book} alt="..." width="30px" height="30px" className="me-2 mb-2"/>
                            Add Book
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/income">
                            <img src={IMG.Income} alt="..." width="30px" height="30px" className="me-2 mb-2"/>
                            Income
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/table-income">
                            <img src={IMG.Table} alt="..." width="30px" height="30px" className="me-2 mb-2"/>
                            Table Transaction
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Button} onClick={Logout}>
                            <img src={IMG.Logout} alt="..." width="30px" height="30px" className="me-2"/>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                    :
                    state.user.role === "user" ?
                    <div className="d-flex gap-3 align-items-center">
                        <Link to="/cart" className="position-relative text-white">
                            <img src={IMG.Cart} alt="..." width="35px" height="32px"/>
                            <p className="bg-danger rounded-circle border border-light px-1 position-absolute top-0 end-0" style={{fontSize:"10px"}}>0</p>
                        </Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown" align="end">
                            <NavDropdown.Item as={Link} to="/profile">
                                <img src={IMG.Profile} alt="..." width="30px" height="30px" className="me-2"/>
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Button} onClick={Logout}>
                                <img src={IMG.Logout} alt="..." width="30px" height="30px" className="me-2"/>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                    :
                    <div className="d-flex gap-3">
                        <Button variant="outline-dark rounded-0" style={{width:"100px"}} onClick={() => {setModalShow(true)}}>Login</Button>
                        <Button variant="dark rounded-0" style={{width:"100px"}} onClick={() => {setModalShowRegister(true)}}>Register</Button>
                    </div>
                    }
                </Container>
            </Navbar>
            <COMP.Login show={modalShow} onHide={() => setModalShow(false)} setmodal={setModalShow} setmodalregister={setModalShowRegister}/>
            <COMP.Register show={modalShowRegister} onHide={() => setModalShowRegister(false)} setmodal={setModalShow} setmodalregister={setModalShowRegister}/>
        </div>
    )
}

export default Header