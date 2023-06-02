import { Button, Modal, Form } from 'react-bootstrap';
import {useState} from 'react';

//Component for create post modal on the profile
const CreatePost = (props) => {

    //Data hooks for post creation
    const [show, setShow] = useState(false); //Show and close modal
    const [formData, setFormData] = useState({ //Form data for uploaded Post
        descr: null,
        file: null,
        access: null,
        category: null
    });

    //Fetch games of user
    const Games = props.gameCategory;   

    //Methods to close and open modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Function to handle the form input and save into data hook
    const handleInput = (e) => {

        //Fetch the altered field name and value
        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        //Check if its a file or text (fileupload needs different handling)
        if (fieldName == "file") {
            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: e.target.files[0]
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: fieldValue
            }));
        }
    }

    //Submit function of form in modal
    const handleSubmit = async (event) => {
        //preventing auto refresh
        event.preventDefault();

        //Variable for upload form data
        let postData = new FormData();

        //Fill form data
        postData.append("descr", formData.descr);
        postData.append("file", formData.file);
        postData.append("access", formData.access);
        postData.append("category", formData.category);

        const endpoint = '/api/createPost'

        const options = {
            method: 'POST',
            headers: {
                'token': localStorage.getItem("token"),
            },
            body: postData,
        }
        
        const response = await fetch(endpoint, options); 

        if (!response.ok) {
            console.log("error");
        } else {
            console.log("success");
        }

        //Close modal after processing
        setShow(false);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create Post
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="uploadForm">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descr" onChange={handleInput} required />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select file</Form.Label>
                            <Form.Control type="file" accept="image/*, video/*, audio/*" name="file" onChange={handleInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Who should see your post?</Form.Label>
                            <Form.Select aria-label="Default select example" name="access" onChange={handleInput}>
                                <option value="1">Everyone</option>
                                <option value="2">Followers</option>
                                <option value="3">Steam friends</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Category/Game</Form.Label>
                            <Form.Select aria-label="Default select example" name="categroy" onChange={handleInput}>
                                {Games ? Games.map((gameInfo) => (<option key={gameInfo.appid} value={gameInfo.appid}>{gameInfo.name}</option>)) : <p>Loading</p>}

                            </Form.Select>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button type="submit" form="uploadForm" variant="primary" onClick={handleSubmit}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreatePost