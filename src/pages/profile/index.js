import React from 'react'
import { Container, Button, Form} from 'react-bootstrap'
import * as react from 'react'
import * as COMP from "../../component"
import * as IMG from "../../assets"
import {FallingLines} from 'react-loader-spinner'
import { UserContext } from '../../context'
import { useQuery } from 'react-query'
import { API } from '../../config/api'

function Profile() {
    document.title = "Your Profile"
    react.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [state, _] = react.useContext(UserContext)
    const [modalShow, setModalShow] = react.useState(false)
    const [search, setSearch] = react.useState("")

    const { data : user, isLoading, refetch } = useQuery("profileCache", async () => {
        const response = await API.get(`/user/${state.user.id}`)
        return response.data.data
    })

    console.log(user)

    react.useEffect(() => {
        refetch()
    }, [])

    const downloadPdf = (url) => {
        fetch(url).then(response => response.blob()).then(blob => {
            const blobURL = window.URL.createObjectURL(new Blob([blob]));
            const fileName = url.split("/").pop();
            const a = document.createElement("a");
            a.href = blobURL;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    }

  return isLoading ? 
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
    <div className="mb-5">
    <Container className='mb-5' style={{width:"900px"}}>
        <h1 style={{fontFamily:"Times New Roman"}} className="mt-5 fw-bold">Profile</h1>
        <div className='d-flex gap-2 bg-danger-subtle px-5 py-4 rounded-2 mt-5' style={{height:"334px"}}>
            <div className="d-flex flex-column gap-3">
                <div className='d-flex gap-2 align-items-center' style={{height:"fit-content"}}>
                    <img src={IMG.Mail} alt='...' width="30px" height="24px" className='object-fit-contain'/>
                    <div style={{height:"2.8rem"}}>
                        <b style={{fontSize:"14px"}}>{state.user.email}</b>
                        <p className='text-muted' style={{fontSize:"12px"}}>Email</p>
                    </div>
                </div>
                <div className='d-flex gap-2 align-items-center' style={{height:"fit-content"}}>
                    <img src={IMG.Gender} alt='...' width="30px" height="30px" className='object-fit-contain'/>
                    <div style={{height:"2.8rem"}}>
                        <b style={{fontSize:"14px"}}>{state.user.gender}</b>
                        <p className='text-muted' style={{fontSize:"12px"}}>Gender</p>
                    </div>
                </div>
                <div className='d-flex gap-2 align-items-center' style={{height:"fit-content"}}>
                    <img src={IMG.Phone} alt='...' width="30px" height="24px" className='object-fit-contain'/>
                    <div style={{height:"2.8rem"}}>
                        <b style={{fontSize:"14px"}}>{state.user.phone}</b>
                        <p className='text-muted' style={{fontSize:"12px"}}>Phone</p>
                    </div>
                </div>
                <div className='d-flex gap-2 align-items-center' style={{height:"fit-content"}}>
                    <img src={IMG.Address} alt='...' width="30px" height="24px" className=  'object-fit-contain'/>
                    <div className='w-50' style={{height:"2.8rem"}}>
                        <b style={{fontSize:"14px"}}>{state.user.address}</b>
                        <p className='text-muted' style={{fontSize:"12px"}}>Address</p>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column' style={{minWidth:"226px", minHeight:"202px"}}>
                <img src={state.user.avatar !== "" ? state.user.avatar : IMG.Male} alt="..." width="100%" height="100%" className='object-fit-contain mb-2 rounded-2'/>
                <Button variant="danger" className='w-100' onClick={() => setModalShow(true)}>Edit Profile</Button>
            </div>
        </div>

        <COMP.UpdateUser show={modalShow} onHide={() => setModalShow(false)}/>
    </Container>
    <Container fluid className="ps-4" style={{width:"1200px"}}>
        {user?.transaction.length > 0 ? (
            <>
            <h1 style={{fontFamily:"Times New Roman"}} className="mt-5 mb-3 fw-bold">My Books</h1>
            <Form.Control type="text" name="search" id="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search your book"/>
            <div className="w-100 d-flex flex-wrap mt-4" style={{gap:"2rem"}}>
                { 
                     user?.transaction.map((item) => {
                        if (item.status === "success") {
                            return item.book.filter(e => {
                                if (search === "") {
                                    return e
                                  } else if (e.title.toLowerCase().includes(search.toLowerCase())) {
                                    return e
                                  } else if (e.author.toLowerCase().includes(search.toLowerCase())) {
                                    return e
                                  } else if (e.isbn.toLowerCase().includes(search.toLowerCase())) {
                                    return e
                                  } 
                            }).map((book, index) => (
                                <div key={index} style={{width:"200px"}}>
                                    <img src={book.thumbnail} alt='...' width="200px" height="270px" className='object-fit-cover mb-3'/>
                                    <b className='mb-3' style={{fontSize:"24px", fontFamily:"Times New Roman", marginBottom:"0", lineHeight: "30px"}}>{book.title.substr(0, 13)} ...</b>
                                    <i className="text-muted d-block mt-2 mb-3" style={{fontSize:"14px"}}>{book.author}</i>
                                    <Button variant="dark" className="rounded-0 w-100" onClick={() => downloadPdf(book.book_attachment)}>Download</Button>
                                </div>
                            ))
                        }
                    })}
            </div>
            </>
        ) : (
            <div className='border border-dark border-2 text-center w-50 mx-auto p-3 rounded-2'>
                <h3 className='text-dark' style={{fontFamily:"Times New Roman"}}>You dont have a book</h3>
            </div>
        )}
    </Container>
    </div>
  )
}

export default Profile