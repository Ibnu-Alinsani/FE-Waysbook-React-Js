import React from 'react'
import { Container } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { API } from '../../config/api'

function Income() {

    const {data: book} = useQuery("bookIncome", async () => {
        const response = await API.get("/books")
        return response.data.data 
    })

    console.log(book)
    let total = 0;
  return (
    <Container fluid style={{padding: "0 3rem"}}>
        <h1 className='mt-5 ps-4' style={{fontFamily: "Times New Roman"}}>Income Book</h1>
        <div className='w-100 d-flex flex-wrap flex-column'>
            <div className='mb-5' style={{marginBottom:"5rem",marginTop:"5rem"}}>
                <div className='d-flex flex-wrap ' style={{gap:"3rem", paddingLeft:"2rem"}}>
                {book && book.map((item, index) => (
                    <Link to={`/detail-book/${item.id}`} key={index} className='text-decoration-none text-dark'>
                        <div className='d-flex flex-column' style={{width:"200px"}}>
                            <img src={item.thumbnail} alt='' width="200px" height="270px" className='object-fit-cover'/>
                            <b className='mt-3 text-dark' style={{ fontFamily: "Times New Roman", fontSize: "24px", lineHeight: "30px"}}>{item.title}</b>
                            <small className='text-muted mt-2'><i>{item.author}</i></small>
                            <b className='mt-3 text-success' style={{ fontSize: "18px" }}>
                                Price : {
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(item.price)
                                }
                            </b>
                            <b className='mt-2 text-success' style={{ fontSize: "18px" }}>
                                Income : {
                                    (() => {
                                        for (let i = 0; i < item.transaction.length; i++) {
                                            total += item.transaction[i].counter_qty;
                                        }
                                        return new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR"
                                        }).format(item.price * total);
                                    })()
                                }
                            </b>
                            <small className='mt-2'>QTY : {total}</small>
                        </div>
                    </Link>
                ))}
                </div>
            </div>
        </div>
    </Container>
  )
}

export default Income
