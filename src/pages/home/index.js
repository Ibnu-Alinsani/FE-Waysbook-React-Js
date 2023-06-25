import { Container, Button } from "react-bootstrap";
import * as react from "react";
import * as IMG from "../../assets";
import * as COMP from "../../component";
import { UserContext } from "../../context";
import { API } from "../../config/api";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import { FallingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";

function Home() {
  react.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  document.title = "Home";

  const [state, dispatch] = react.useContext(UserContext);

  // Top 3
  const { data: book, isLoading } = useQuery("populerCache", async () => {
    const response = await API.get("/books");
    return response.data.data;
  });

  const [topThree, setTopThree] = react.useState([]);
  react.useEffect(() => {
    const sorted = book?.sort(
      (a, b) => b.transaction.length - a.transaction.length
    );
    setTopThree(sorted?.slice(0, 3));
  }, [book]);

  react.useEffect(() => {
    if (state.user.name) {
      const intervalId = setInterval(() => {
        document.title = `Halo, ${state.user.name}`;
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        document.title = `Home`;
      }, 5000);
    }
  }, [state]);

  // Drag Event
  const containerRef = react.useRef(null);
  let isDragging = false;
  let mouseStartX, scrollStartX;

  react.useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      isDragging = true;
      mouseStartX = e.clientX;
      scrollStartX = container.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const mouseDeltaX = e.clientX - mouseStartX;
        container.scrollLeft = scrollStartX - mouseDeltaX;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const dragStart = (e) => {
    e.preventDefault();
  };

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
        text: `Added Book`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        title: "Add Failed",
        text: `${error.response.data.message}`,
        // text: `error mase`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

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
    <Container fluid className="mt-5 px-0">
      <h1
        className="text-center"
        style={{ fontFamily: "Times New Roman", fontSize: "48px" }}
      >
        With us, you can shop online & help
        <br />
        save your high street at the same time
      </h1>
      <Container
        ref={containerRef}
        fluid
        className="px-0 d-flex overflow-x-hidden"
        style={{ gap: "3.3rem", marginTop: "6rem" }}
      >
        {topThree &&
          topThree.map((book, index) => (
            <Link
              to={`/detail-book/${book.id}`}
              key={index}
              className="text-decoration-none text-dark"
            >
              <div
                className="d-flex align-items-center position-relative"
                draggable="true"
                onDragStart={dragStart}
              >
                <img
                  src={IMG.Best}
                  alt="best"
                  width="60px"
                  height="60px"
                  className="object-fit-cover position-absolute top-0 end-50"
                />
                <img
                  src={book.thumbnail}
                  alt="..."
                  width="236px"
                  height="345px"
                  className="object-fit-cover"
                />
                <div
                  className="p-3 pb-3"
                  style={{ width: "268px", height: "277px" }}
                >
                  <b
                    style={{
                      fontFamily: "Times New Roman",
                      fontSize: "24px",
                      lineHeight: "15px",
                    }}
                  >
                    {book.title}
                  </b>
                  <small className="d-block mb-3 text-muted">
                    <i>By. {book.author}</i>
                  </small>
                  <p
                    className="mb-4"
                    style={{ lineHeight: "121,5%", fontSize: "14px" }}
                  >
                    {book.description.substr(0, 16)} ...
                  </p>
                  <p
                    className="mb-2 text-success fw-bold"
                    style={{ fontSize: "18px" }}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(book.price)}
                  </p>
                  {book.transaction.filter((e) => e.user_id === state.user.id)
                    .length > 0 ? (
                    <Button
                      variant="dark"
                      className="rounded-0 w-100"
                      onClick={(e) => AddCart.mutate(book.id)}
                    >
                      Download
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      className="rounded-0 w-100"
                      onClick={(e) => AddCart.mutate(book.id)}
                    >
                      Add To Cart
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </Container>

      <div className="px-0 mx-auto" style={{ width: "1200px" }}>
        <COMP.BookList />
      </div>
    </Container>
  );
}

export default Home;
