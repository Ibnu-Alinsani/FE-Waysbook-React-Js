import { useContext, useState } from "react"
import { Form, Modal, Button } from "react-bootstrap"
import { API } from "../../../config/api"
import { useMutation } from "react-query"
import { UserContext } from "../../../context"
import { Navigate } from "react-router-dom"
import Swal from "sweetalert2";

function Login(props) {
    const [_, dispatch] = useContext(UserContext)
    
    const [form, setForm] = useState({
        email: "", 
        password:""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const submit = useMutation(async (e) => {
        e.preventDefault()
        try {
            const response = await API.post("/login", form)
            console.log("login success", response.data.data)

            dispatch({
                isLogin: true,
                type: "LOGIN_SUCCESS",
                payload: response.data.data
            })

            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                iconColor: 'white',
                customClass: {
                  popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
              })
            
            await Toast.fire({
            icon: 'success',
            title: `Login Success, Welcome ${response.data.data.name}`
            })            

            setForm({
                email: "", 
                password:""
            })

            // return <Navigate to="/" replace/>
            setTimeout(() => {
                props.setmodal(false)
                window.location.reload()
            }, 1000)

        } catch (err) {
            Swal.fire({
                title: "Login Failed",
                text: `Wrong Email or Password`,
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    })

    return (
    <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Form className="p-5" onSubmit={(e) => submit.mutate(e)}>
            <h4 style={{fontFamily: "Times New Roman", fontSize:"36px"}} className="mb-4 fw-bold">Login</h4>
            <Form.Group className="mb-3">
                <Form.Control type="email" id="email" placeholder="Email" className="p-2 bg-body-secondary" name="email" onChange={handleChange}/>
            </Form.Group>   
            <Form.Group className="mb-3">
                <Form.Control type="password" id="password" placeholder="Password" className="p-2 bg-body-secondary" name="password" onChange={handleChange}/>
            </Form.Group>
            <Button className="w-100 p-2 mt-4 rounded-0 fw-bold bg-dark border-dark" type="submit">Login</Button>
        </Form>
        <p className="text-center">
            Don't have an account? 
            <button style={{background:"none", border:"none"}} className="fw-semibold" 
            onClick={() => {
                props.setmodal(false)
                props.setmodalregister(true)
            }}>
                Klik here
            </button>
        </p>
    </Modal>
    )
}

export default Login