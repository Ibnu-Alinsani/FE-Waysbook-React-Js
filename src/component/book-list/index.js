import * as react from 'react'
import { useQuery } from 'react-query'
import { API } from '../../config/api'
import { Link } from "react-router-dom"
import { Form } from 'react-bootstrap'

function BookList() {
  const [search, setSearch] = react.useState('')

  const {data: book} = useQuery("bookList", async () => {
    const response = await API.get("/books")
    return response.data.data 
  })
  console.log(search)

  return (
    <div className='mb-5' style={{marginBottom:"10rem",marginTop:"5rem"}}>
        <b className='mb-5' style={{ fontFamily: "Times New Roman", fontSize: "36px"}}>List Book</b>
        <Form.Control type="text" placeholder="Search by Title | Author | ISBN | Price without ( . ) example: 990000" name="search" onChange={(e) => setSearch(e.target.value)} id="search"/>
        <div className='d-flex flex-wrap ' style={{gap:"3rem", marginTop:"2rem"}}>
        {book && book.filter(e => {
          if (search === "") {
            return e
          } else if (e.title.toLowerCase().includes(search.toLowerCase())) {
            return e
          } else if (e.author.toLowerCase().includes(search.toLowerCase())) {
            return e
          } else if (e.isbn.toLowerCase().includes(search.toLowerCase())) {
            return e
          } else if (e.price.toString().toLowerCase().includes(search.toLowerCase())) {
            return e
          } 
        }).map((item, index) => (
          <Link to={`/detail-book/${item.id}`} key={index} className='text-decoration-none'>
            <div className='d-flex flex-column' style={{width:"200px"}}>
                <img src={item.thumbnail} alt='' width="200px" height="270px" className='object-fit-cover'/>
                <b className='mt-3 text-dark' style={{ fontFamily: "Times New Roman", fontSize: "24px", lineHeight: "30px"}}>{item.title.substr(0, 13)} ...</b>
                <small className='text-muted mt-2'><i>{item.author}</i></small>
                <b className='mt-3 text-success' style={{fontSize: "18px"}}>{new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.price)}</b>
            </div>
          </Link>
        ))}
        </div>
    </div>
  )
}

export default BookList