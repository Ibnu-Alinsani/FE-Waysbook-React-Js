import { Form } from "react-bootstrap";
import * as IMG from "../../assets";
function InputImage(props) {
  return (
    <Form.Group>
      <Form.Label
        className="w-md-75 w-sm-100 border border-dark-subtle bg-body-secondary border-2 rounded-2 ps-2 position-relative"
        style={{
          cursor: "pointer",
          height: "3rem",
          lineHeight: "2.8rem",
        }}
      >
        <p className="d-inline">{props.title}</p>
        <img
          src={IMG.Pin}
          alt="..."
          width="25"
          height="25"
          className="ms-5 object-fit-contain position-absolute end-0"
          style={{ marginTop: "-5px", top: "30%" }}
        />
        <Form.Control
          type="file"
          id={props.id}
          name={props.name}
          onChange={props.handleChange}
          className="invisible"
        />
      </Form.Label>
    </Form.Group>
  );
}

export default InputImage;
