import React, { useContext, useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import * as IMG from '../../assets'
import { UserContext } from '../../context'
import { API } from '../../config/api'
import { useMutation, useQuery } from 'react-query'
import { FallingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

function Cart() {
    document.title = "Cart"
    const [state, dispatch] = useContext(UserContext)
    const [total, setTotal] = useState(0)

    const { data : user, isLoading, refetch } = useQuery("cartCache", async () => {
        const response = await API.get(`/user/${state.user.id}`)
        return response.data.data
    })

    useEffect(() => {
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
      }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        let totalPrice = 0
        if (user && user.cart_item) {
            user.cart_item.forEach((item) => {
                totalPrice += item.book.price
            })
            setTotal(totalPrice)
        }

    }, [user])
        
    const deleteBook = useMutation(async (e) => {
        try {
            const response = await API.delete(`/cart/${e}`)
            refetch()
        } catch (error) {
            console.log("delete failed",error)
        }
    })

    const navigate = useNavigate()

    const pay = useMutation(async () => {
        try {
            console.log("pay")
            const response = await API.post(`/transaction`, {
                status: "pending",
            })
            console.log(response.data.data)
            const token = response.data.data.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                console.log(result, "success");
                navigate("/profile");
                },
                onPending: function (result) {
                console.log(result, "pending");
                navigate("/profile");
                },
                onError: function (result) {
                console.log(result, "error");
                navigate("/profile");
                },
                onClose: function () {
                alert("you closed the popup without finishing the payment");
                },
            });
            refetch()
        } catch (error) {
            console.log("pay failed",error)
        }
    })

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
  ) : user?.cart_item.length === 0 ? (
    <Container fluid className='my-4 d-flex justify-content-center align-items-center flex-column'>
        <h1 className='my-4' style={{fontFamily: "Times New Roman"}}>Nothing Book In Your Cart</h1>
        <img src={IMG.Cart} alt='cart'/>
    </Container>
  ) : (
    <Container className="" style={{width:"900px"}}>
        <h1 className='my-4' style={{fontFamily: "Times New Roman", fontSize:"24px"}}>My Cart</h1>
        <div className='d-flex gap-5'>
            <div className='border-bottom border-dark pb-4' style={{width:"200%"}}>
                <div className='border-bottom border-dark mb-4'>
                    <p className="" style={{marginBottom:"5px"}}>Review Your Order</p>
                </div>
                {user?.cart_item.map((item, index) => {
                    return (
                        <div className='d-flex mb-4 gap-3 justify-content-between' key={index}>
                            <img src={item.book.thumbnail} alt='...' width="130px" height="175.5px" className='object-fit-cover'/>
                            <div className='w-100'>
                                <b style={{fontFamily:"Times New Roman", fontSize:"18px"}}>{item.book.title}</b>
                                <i className="text-muted d-block mb-3" style={{fontSize:"14px"}}>{item.book.author}</i>
                                <b className="text-success" style={{fontSize:"14px"}}>
                                    {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    }).format(item?.book.price)}
                                </b>
                            </div>
                            <img src={IMG.Bin} alt='...' width="20px" height="20px" style={{cursor:"pointer"}} onClick={() => deleteBook.mutate(item.book.id)}/>
                        </div>
                    )
                })}
            </div>
            <div className='w-100 position-relative' style={{marginTop:"1.8rem"}}>
                <div className='border-bottom border-top border-dark py-3 mb-3'>
                    <div className='d-flex justify-content-between mb-2'>
                        <small>Subtotal</small>
                        <small>{total !== 0 ? (
                            new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            }).format(total)
                        ) : "menghitung..."}</small>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <small>Qty</small>
                        <small>{user?.cart_item.length}</small>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <small className='text-success'>Total</small>
                    <small className='text-success'>
                        {total !== 0 ? (
                            new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            }).format(total)
                        ) : "menghitung..."}
                    </small>
                </div>
                <Button variant="dark" className="w-75 mt-4 position-absolute end-0 left-0" onClick={() => pay.mutate()}>Pay</Button>
            </div>
        </div>
    </Container>
  )
}

export default Cart