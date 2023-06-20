import { useEffect } from 'react';
import {Container, Table} from 'react-bootstrap';
import { useQuery } from 'react-query';
import { API } from '../../config/api';

function TableIncome() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    document.title = "Table Income"

    const {data : trans} = useQuery("transCache", async () => {
        const response = await API.get("/transactions")
        return response.data.data
    })

  return (
    <Container>
        <h2 className="mb-5" style={{fontFamily: "Times New Roman"}}>Income Transaction</h2>
        <Table striped bordered hover>
        <thead>
            <tr>
                <th className='text-danger text-center'>No</th>
                <th className='text-danger'>Users</th>
                <th className='text-danger'>Book Purchased</th>
                <th className='text-danger text-center'>Total Payment</th>
                <th className='text-danger text-center'>Status Payment</th>
            </tr>
        </thead>
        <tbody>
            {
                trans && trans.map((item, index) => (
                    <tr key={index}>
                        <td className='text-center'>{index + 1}</td>
                        <td>{item.user.name}</td>
                        <td style={{width: "500px"}}>{item.book.map(e => e.title).join(", ")}</td>
                        {item.status === "success" ? 
                        <td className='text-success text-center'>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(item.total_payment)}
                        </td>
                        :
                        <td className='text-danger text-center'>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(item.total_payment)}
                        </td>
                        }                        
                        {item.status === "success" ? <td className='text-success text-center'>Success</td> 
                        : 
                        item.status === "failed" ? <td className='text-danger text-center'>Failed</td>
                        :
                        <td className='text-warning text-center'>Pending</td>
                        }   
                    </tr>
                ))
            }
        </tbody>
        </Table>
    </Container>
  );
}

export default TableIncome;