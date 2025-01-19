import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Appbar from '../../components/common/appbar/Appbar';
import "./KidgageNews.css";
import axios from 'axios';
import AddNewsModal from '../../components/newsModal/AddNewsModal';
import NewsEditModal from '../../components/newsModal/NewsEditModal';
import DeleteNewsModal from '../../components/newsModal/DeleteNewsModal';

function KidgageNews(searchdata) {
    const [newsDetails, setNewsDetails] = useState([]);
    const [addStatus, setAddStatus] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState([]);
    const [editStatus, setEditStatus] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [newsEditModalState, setNewsEditModalState] = useState({
        isShow: false,
        data: null,
    });
    const [showDeleteModal, setShowDeleteModal] = useState({
        isShow: false,
        newsId: null,
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [expandedState, setExpandedState] = useState({});

    const getAllNewsDetails = async () => {
        const result = await axios.get(`http://localhost:5001/api/news?search=${searchKey}`);
        if (result.status === 200) {
            setNewsDetails(result.data);
        }
    };

    // Add news modal handlers
    const newsAddModalOpenHandler = () => setShowAddModal(true);
    const newsAddModalCloseHandler = () => setShowAddModal(false);

    // Edit news modal handlers
    const newsEditModalOpenHandler = (editModalData) =>
        setNewsEditModalState({
            isShow: true,
            data: editModalData,
        });
    const newsEditModalCloseHandler = () =>
        setNewsEditModalState({
            isShow: false,
            data: null,
        });

    // Delete news modal handlers
    const deleteNewsModalOpenHandler = (newsId) => {
        setShowDeleteModal({ isShow: true, newsId });
    };
    const deleteNewsModalCloseHandler = () => {
        setShowDeleteModal({ isShow: false, newsId: null });
    };

    const toggleExpand = (id) => {
        setExpandedState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB").replace(/\//g, "-");
    };

    const handleChildData = (data) => {
        setSearchKey(data);
    };
    const handleToggleStatus = async (newsId, currentStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5001/api/news/update-status/${newsId}`,
                { newsStatus: currentStatus }
            );
            if (response.status === 200) {
                alert("Status updated successfully");
                setEditStatus((prev) => !prev);
            }
        } catch (error) {
            console.error("Error updating news status:", error);
            alert("Failed to update news status. Please try again.");
        }
    };


    useEffect(() => {
        getAllNewsDetails();
    }, [addStatus, deleteStatus, editStatus, searchKey]);

    return (
        <div className="newspage-container">
            {
                (!searchdata ||
                    (Array.isArray(searchdata) && searchdata.length === 0) ||
                    (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)) && (
                    <Appbar sendDataToParent={handleChildData} />
                )
            }
            <h3 className="newspage-content-heading">Kidgage News</h3>
            <div className="newspage-content-container">
                <div className="news-button-container">
                    <button
                        className="add-news-button"
                        onClick={newsAddModalOpenHandler}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{ color: "#ffffff", marginRight: '5px' }}
                        />
                        Add News
                    </button>
                </div>

                {newsDetails.length > 0 ? (
                    <table className="news-table-details">
                        <thead className="table-head">
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsDetails.map((news) => (
                                <tr key={news._id}>
                                    <td>
                                        <div className="news-img">
                                            <img
                                                src={news.image}
                                                alt="News Img"
                                            />
                                        </div>
                                    </td>
                                    <td>{news.title}</td>
                                    <td className='news-description'>
                                        <p>
                                            {expandedState[news._id] ? news.description : `${news.description.substring(0, 100)}...`}
                                        </p>
                                        {news.description.length > 100 && (
                                            <button
                                                className='toggle-button'
                                                onClick={() => toggleExpand(news._id)}
                                            >
                                                {expandedState[news._id] ? 'Show less' : 'More...'}
                                            </button>
                                        )}
                                    </td>
                                    <td>{formatDate(news.publishedOn)}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                defaultChecked={news.activeStatus}
                                                onChange={() => handleToggleStatus(news._id, news.activeStatus)}
                                            ></input>
                                            <span className="slider round"></span>
                                        </label>
                                    </td>

                                    <td>
                                        <div className="news-icons">

                                            <FontAwesomeIcon
                                                icon={faPenToSquare}
                                                style={{ color: "#106cb1", cursor: "pointer" }}
                                                onClick={() => newsEditModalOpenHandler(news)}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                style={{ color: "#d70404", cursor: "pointer" }}
                                                onClick={() => deleteNewsModalOpenHandler(news._id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: 'red', marginTop: '20px', fontSize: '15px' }}>Nothing to display</p>
                )}
            </div>

            {showAddModal && (
                <AddNewsModal
                    isShow={showAddModal}
                    closeHandler={newsAddModalCloseHandler}
                    setAddStatus={setAddStatus}
                />
            )}

            {newsEditModalState.isShow && (
                <NewsEditModal
                    isShow={newsEditModalState.isShow}
                    closeHandler={newsEditModalCloseHandler}
                    newsData={newsEditModalState.data}
                    setEditStatus={setEditStatus}
                />
            )}

            {showDeleteModal.isShow && (
                <DeleteNewsModal
                    isShow={showDeleteModal.isShow}
                    closeHandler={deleteNewsModalCloseHandler}
                    newsDeleteId={showDeleteModal.newsId}
                    setDeleteStatus={setDeleteStatus}
                />
            )}
        </div>
    );
}

export default KidgageNews;
