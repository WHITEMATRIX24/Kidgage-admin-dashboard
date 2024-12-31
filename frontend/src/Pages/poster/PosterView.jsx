import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Appbar from '../../components/common/appbar/Appbar';
import "./PosterView.css";
import axios from 'axios';
import AddPosterModal from '../../components/PosterModal/AddPosterModal';
import DeletePosterModal from '../../components/PosterModal/DeletePosterModal';
import PosterEditModal from '../../components/PosterModal/PosterEditModal';


function PosterView(searchdata) {
    const [posterDeails, setPosterDetails] = useState([])
    const [addstatus,setAddStatus]=useState([])
    const [deleteStatus,setDeleteStatus]=useState([])
    const [editStatus,setEditStatus]=useState([])
    const[searchKey,setSearchKey]=useState("")
    const [posterEditModalState, setPosterEditModalState] = useState({
        isShow: false,
        data: null,
    });
    const [showDeleteModal, setShowDeleteModal] = useState({
        isShow: false,
        posterId: null,
    });
    const [deletePosterId, setDeletePosterId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [expandedState, setExpandedState] = useState({}); 
    const getAllPosterDetails = async () => {
        const result = await axios.get(`https://admin.kidgage.com/api/posters?search=${searchKey}`
        );
        if (result.status == 200) {
            setPosterDetails(result.data)
        }
    }

    console.log(searchKey);
    
    // Add poster modal handler
    const posterAddModalOpenHandler = () => setShowAddModal(true);

    // Add poster modal handler
    const posterAddModalCloseHandler = () => setShowAddModal(false);


    // edit poster modal Open handler
    const posterEditModalOpenHandler = (editModalData) =>
        setPosterEditModalState({
            isShow: true,
            data: editModalData,
        });

    // edit poster modal Close handler
    const posterEditModalCloseHandler = (editModalData) =>
        setPosterEditModalState({
            isShow: false,
            data: null,
        });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date
            .toLocaleDateString("en-GB") // 'en-GB' will return 'dd/mm/yyyy'
            .replace(/\//g, "-"); // Replace slashes with dashes
        return formattedDate;
    };


    // delete poster modal open handler
    const deletePosterModalOpenHandler = (posterId) => {
        setShowDeleteModal({ isShow: true, posterId });
    };

    // delete poster modal close handler
    const deletePosterModalCloseHandler = (categoryId) => {
        setShowDeleteModal({ isShow: false, categoryId: null });
    };

    const toggleExpand = (id) => {
        setExpandedState(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expansion state of the current poster
        }));
     
    };

    const handleChildData = (data) => {
        setSearchKey(data); // Set the received data to state
      };


    useEffect(() => {
        getAllPosterDetails();
    }, [addstatus,deleteStatus,editStatus,searchKey])
    return (
        <div className="posterpage-container">
          {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }
            <h3 className="posterpage-content-heading"> Event Posters</h3>
            <div className="posterpage-content-container">
                <div className="poster-button-container">
                    <button
                        className="add-poster-button"
                        onClick={posterAddModalOpenHandler}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#ffffff", marginRight: '5px' }}
                        />
                        Add Poster
                    </button>
                </div>

                {/* Conditional Rendering based on activeTab */}
                {posterDeails.length > 0 ?
                    <table className="poster-table-details">
                        <thead className="table-head">
                            <tr>
                                <th>Banner Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posterDeails?.map((poster) => {
                                const startDate = new Date(poster.startDate);
                                const endDate = new Date(poster.endDate);
                                return (<tr>
                                    <td>
                                        <div className="poster-img">
                                            <img 
                                                src={poster.image}
                                                alt="Banner Img"
                                            />
                                        </div>
                                    </td>
                                    <td>{poster.name}</td>
                                    <td className='poster-description'>      <p>
                                    {expandedState[poster._id] ? poster.description : `${poster.description.substring(0, 100)}...`} 
                                    </p>
                                        {poster.description.length > 100 && (  // Show "Show more" only if the description is long enough
                                            <button className='toggle-button' onClick={() => toggleExpand(poster._id)}>
                                                 {expandedState[poster._id] ? 'Show less' : 'More...'}
                                            </button>
                                        )}</td>
                                    <td>
                                        {formatDate(startDate)} to {formatDate(endDate)}
                                    </td>
                                    <td>
                                        <div className="poster-icons">
                                            {/* <FontAwesomeIcon
                                            icon={course.active === "true" ? faEye : faEyeSlash}
                                            style={{ color: "#000205", cursor: "pointer" }}


                                        /> */}
                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                style={{ color: "#106cb1", cursor: "pointer" }}
                                                onClick={() => posterEditModalOpenHandler (poster)}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                style={{ color: "#d70404", cursor: "pointer" }}
                                                onClick={() => deletePosterModalOpenHandler(poster._id)}
                                            />
                                        </div>
                                    </td>
                                </tr>)
                            })}

                        </tbody>
                    </table>
                    : <p style={{ color: 'red', marginTop: '20px', fontSize: '15px' }}>Nothing to display</p>}
            </div>

            {/* Add modal */}
            {showAddModal && (
                <AddPosterModal
                    isShow={showAddModal}
                    closeHandler={posterAddModalCloseHandler}
                    setAddStatus={setAddStatus}
                />
            )}


            {/* Edit modal */}
            {posterEditModalState.isShow && (
                <PosterEditModal
                    isShow={posterEditModalState.isShow}
                    closeHandler={posterEditModalCloseHandler}
                    posterData={posterEditModalState.data}
                    setEditStatus={setEditStatus}
                />
            )}


            {/* delete modal */}
            {showDeleteModal.isShow && showDeleteModal.isShow && (
                <DeletePosterModal
                    isShow={showDeleteModal.isShow}
                    closeHandler={deletePosterModalCloseHandler}
                    posterDeleteId={showDeleteModal.posterId}
                    setDeleteStatus={setDeleteStatus}
                />
            )}
        </div>
    )
}

export default PosterView