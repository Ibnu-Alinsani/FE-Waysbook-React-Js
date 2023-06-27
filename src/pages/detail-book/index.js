import { Col, Container, Row, Button } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import * as UTILS from "../../utils";
import * as IMG from "../../assets";
import { API } from "../../config/api";
import { FallingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useContext } from "react";
import { UserContext } from "../../context";

function DetailBook() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  document.title = "Detail Book";

  const [state, _] = useContext(UserContext);
  console.log(state);
  const { id } = useParams();

  const { data: book, isLoading } = useQuery("bookCache", async () => {
    const response = await API.get(`/book/${id}`);
    return response.data.data;
  });
  // console.log(book.id);

  const navigate = useNavigate();

  const AddCart = useMutation(async (e) => {
    try {
      if (!state.IsLogin) {
        return Swal.fire({
          title: "Warning",
          text: "Please login to be proceed",
          icon: "warning",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      const response = await API.post("/cart", {
        book_id: e,
      });

      Swal.fire({
        title: "Add Success",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      window.location.reload()
    } catch (error) {
      Swal.fire({
        title: "Add Failed",
        text: `${error.response.data.message}`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

  const deleteBook = useMutation(async (e) => {
    try {
      if (book.transaction.length > 0) {
        Swal.fire({
          title: "Warning",
          text: "This book have transaction",
          icon: "warning",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      const response = API.delete(`/book/${e}`);
      console.log("delete success", response.data.data);
    } catch (error) {
      Swal.fire({
        title: "Delete Failed",
        text: `Please try again later`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      console.log("delete failed", error);
    }
  });

  //Download
  const downloadPdf = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(new Blob([blob]));
        const fileName = url.split("/").pop();
        const a = document.createElement("a");
        a.href = blobURL;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return isLoading ? (
    <Container
      fluid
      className=" text-center d-flex justify-content-center align-items-center"
      style={{ height: "55vh" }}
    >
      <FallingLines
        color="#242424"
        width="100"
        visible={true}
        className="m-auto"
        ariaLabel="falling-lines-loading"
      />
    </Container>
  ) : (
    <Container
      className="mt-5 text-wrap position-relative"
      style={{ marginBottom: "10rem", maxWidth: "1000px" }}
    >
      <Row>
        <Col>
          <img
            src={book?.thumbnail}
            alt="..."
            width="400px"
            height="577px"
            style={{ borderRadius: "10px" }}
            className="object-fit-cover img-thumb"
          />
        </Col>
        <Col>
          <div className="d-flex flex-column gap-3 justify-content-between h-100">
            <div>
              <p
                className="fw-bold"
                style={{
                  fontFamily: "Times New Roman",
                  fontSize: "48px",
                  marginBottom: "0",
                  lineHeight: "60px",
                }}
              >
                {book?.title}
              </p>
              <i
                className="text-muted d-block mt-2"
                style={{ fontSize: "24px" }}
              >
                By. {book?.author}
              </i>
            </div>
            <div className="mt-3">
              <b style={{ marginBottom: "0", fontSize: "24px" }}>
                Publication date
              </b>
              <p className="text-muted mt-2" style={{ fontSize: "18px" }}>
                {book?.publication_date}
              </p>
            </div>
            <div className="mt-3">
              <b style={{ marginBottom: "0", fontSize: "24px" }}>Pages</b>
              <p className="text-muted mt-2" style={{ fontSize: "18px" }}>
                {book?.pages}
              </p>
            </div>
            <div>
              <b
                className="text-danger"
                style={{ marginBottom: "0", fontSize: "24px" }}
              >
                ISBN
              </b>
              <p className="text-muted mt-2" style={{ fontSize: "18px" }}>
                {book?.isbn}
              </p>
            </div>
            <div>
              <b style={{ marginBottom: "0", fontSize: "24px" }}>Price</b>
              <p className="text-success mt-2" style={{ fontSize: "18px" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(book?.price)}
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Col className="mt-5">
        <h1
          style={{
            fontFamily: "Times New Roman",
            fontSize: "36px",
            marginBottom: "1.3rem",
          }}
        >
          About This Book
        </h1>
        <UTILS.AutoParagraph text={book?.description} wordsPerParagraph={60} />
      </Col>

      {book && (
        <>
          {state.user.role === "user" ? (
            book.transaction.filter((item) => item.status === "success" && item.user_id === state.user.id)
              .length > 0 ? (
              <Button
                variant="dark"
                className="mt-5 rounded-0 position-absolute end-0 left-0 px-4"
                onClick={() => downloadPdf(book.book_attachment)}
              >
                Download
              </Button>
            ) : (
              <Button
                variant="dark"
                className="mt-5 rounded-0 position-absolute end-0 left-0"
                onClick={(e) => AddCart.mutate(book.id)}
              >
                Add Cart
                <img
                  src={IMG.Cart2}
                  alt="..."
                  width="24"
                  height="22"
                  className="ms-2"
                />
              </Button>
            )
          ) : state.user.role === "admin" ? (
            <div>
              <Button
                variant="dark"
                className="mt-5 px-5 rounded-0 position-absolute end-0"
                onClick={() => navigate(`/update-book/${book.id}`)}
              >
                Update
              </Button>
              <Button
                variant="danger"
                className="mt-5 px-5 rounded-0 position-absolute"
                style={{ right: "20%" }}
                onClick={() => deleteBook.mutate(book.id)}
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button
              variant="dark"
              className="mt-5 rounded-0 position-absolute end-0 left-0"
              onClick={(e) => AddCart.mutate(book.id)}
            >
              Add Cart
              <img
                src={IMG.Cart2}
                alt="..."
                width="24"
                height="22"
                className="ms-2"
              />
            </Button>
          )}
        </>
      )}
    </Container>
  );
}

export default DetailBook;
