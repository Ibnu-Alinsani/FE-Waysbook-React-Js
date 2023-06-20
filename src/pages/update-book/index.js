import { useEffect, useState } from "react"
import { Container, Form, Button, Row, Col } from "react-bootstrap"
import { API } from "../../config/api"
import { useMutation, useQuery } from "react-query"
import * as IMG from "../../assets"
import * as UTILS from "../../utils"
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom"

function AddBook() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [form, setForm] = useState({
        title: "",
        publication_date: "",
        author: "", 
        pages: "",
        isbn: "",
        price: "",
        discount: "",
        description: "",
        book_attachment: "",
        thumbnail: "",
    })
    const [preview, setPreview] = useState("")
    const [file, setFile] = useState("")

    const {id} = useParams()

    const {data: book, isLoading} = useQuery("updateCache", async () => {
        const response = await API.get(`/book/${id}`)
        return response.data.data
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value
        })

        if (e.target.type === "file" && e.target.name === "thumbnail") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        } 
        if (e.target.type === "file" && e.target.name === "book_attachment") {
            setFile(e.target.files[0].name)
        } 

    }

    const navigate = useNavigate()
    const submit = useMutation(async (e) => {
        e.preventDefault()
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }

            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("publication_date", form.publication_date)
            formData.set("author", form.author)
            formData.set("pages", form.pages)
            formData.set("isbn", form.isbn)
            formData.set("price", form.price)
            formData.set("discount", form.discount)
            formData.set("description", form.description)
            formData.set("file", form.book_attachment[0], form.book_attachment[0].name)
            formData.set("image", form.thumbnail[0], form.thumbnail[0].name)

            const response = await API.patch(`/book/${id}`, formData, config)

            Swal.fire({
                title: "Update Success",
                text: `Enjoy Your show Book`,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            });

            navigate("/income")
        } catch (error) {
            Swal.fire({
                title: "Update Error",
                text: `-- ${error.response}`,
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
            });
            console.log("update book failed", error)
        }
    })

    return book && (
        <Container className="w-75 position-relative" style={{marginBottom:"100px"}}>
            <h2 style={{margin:"50px 0", fontFamily:"Times New Roman"}}>Update Book</h2>
            <Form onSubmit={(e) => submit.mutate(e)}>
                <Form.Group className="mb-4 bg-grey">
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        id="name"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Publication Date"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="publication_date"
                        value={form.publication_date}
                        onChange={handleChange}
                        id="publication_date"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Author"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        id="author"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Pages"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="pages"
                        value={form.pages}
                        onChange={handleChange}
                        id="pages"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="ISBN"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="isbn"
                        value={form.isbn}
                        onChange={handleChange}
                        id="isbn"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="number"
                        placeholder="Price"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        id="price"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        type="number"
                        placeholder="discount"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="discount"
                        value={form.discount}
                        onChange={handleChange}
                        id="discount"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="About This Book"
                        className="p-2 bg-body-secondary border border-dark-subtle border-2"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        id="description"
                    />
                </Form.Group>
                <Row className="d-flex w-100">
                    <Col className="me-4">
                        <UTILS.InputImage title="Attach Book File" id="book_attachment" name="book_attachment" handleChange={handleChange} />
                        <UTILS.InputImage title="Attach Thumbnail" id="thumbnail" name="thumbnail" handleChange={handleChange} />
                    </Col>
                    <Col>
                        {file && <p>Your Name File : <b>{file}</b></p>}
                        {preview && (
                            <>
                                <p>Your Thumbnail</p>
                                <img src={preview} alt="Your Thumbnail" width="118" height="172" className="object-fit-cover"/>
                            </>
                        )}
                    </Col>
                </Row>
                <Button type="submit" variant="dark" className="rounded-0 position-absolute end-0 mt-2">
                    Update Book
                    <img src={IMG.IconBook} alt="..." width="25" height="25" className="ms-3"/>
                </Button>
            </Form>
        </Container>
    )
}

export default AddBook