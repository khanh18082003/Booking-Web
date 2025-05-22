import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosCustomize";
import { useParams } from "react-router-dom";
import { useStore } from "../../utils/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

const ReviewsContent = ({ isLoading: loadingProp }) => {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showAddReview, setShowAddReview] = useState(false);
  const { id } = useParams();
  const { store } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [newReview, setNewReview] = useState({
    review: "",
    rating: 10,
  });
  useEffect(() => {
    fetchReviews(1, true);
    // eslint-disable-next-line
  }, [id]);

  const fetchReviews = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/properties/${id}/reviews?page=${pageNum}&pageSize=10`,
      );
      if (res.data.code === "M000") {
        setMeta(res.data.data.meta);
        setReviews((prev) =>
          reset ? res.data.data.data : [...prev, ...res.data.data.data],
        );
        setPage(pageNum);
      }
    } catch (err) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchReviews(page + 1);
  };

  const handleAddReview = async (e) => {
    if (!store.userProfile) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    e.preventDefault();
    try {
      const payload = {
        review: newReview.review,
        rating: newReview.rating,
        properties_id: id,
      };
      console.log(payload);
      await axios.post(`/reviews`, payload);
      setShowAddReview(false);
      setNewReview({ review: "", rating: 0 });
      fetchReviews(1, true); // reload reviews
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại!");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Đánh giá của khách</h2>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setShowAddReview(true)}
        >
          Thêm đánh giá
        </button>
      </div>

      {showAddReview && (
        <form
          className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-lg"
          onSubmit={handleAddReview}
        >
          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center font-semibold text-blue-700">
              <span className="mr-2">Đánh giá:</span>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview((r) => ({
                    ...r,
                    rating: Number(e.target.value),
                  }))
                }
                className="rounded border border-blue-300 px-2 py-1 focus:ring-2 focus:ring-blue-400"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-3">
            <textarea
              className="w-full rounded-xl border border-blue-200 bg-white p-3 text-gray-700 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              rows={4}
              placeholder="Chia sẻ cảm nhận của bạn về chỗ nghỉ..."
              value={newReview.review}
              onChange={(e) =>
                setNewReview((r) => ({ ...r, review: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
              onClick={() => setShowAddReview(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      )}

      {loading || loadingProp ? (
        <div>Đang tải đánh giá...</div>
      ) : (
        <>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg bg-gray-50 p-4">
                <div className="mb-3 flex justify-between">
                  <div className="flex items-center">
                    <img
                      src={
                        review.avatar ||
                        "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                      }
                      alt={review.name || "avatar"}
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{review.name || "Ẩn danh"}</p>
                      <span className="text-sm text-gray-500">
                        {review.nationality || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="rounded bg-blue-800 px-2 py-1 font-bold text-white">
                      {review.rating}
                    </div>
                  </div>
                </div>
                <p className="mb-2 text-sm">"{review.review}"</p>
                <p className="text-xs text-gray-500">
                  Đã đánh giá:{" "}
                  {new Date(review.create_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
          {reviews.length < (meta.total || 0) && (
            <button
              className="mt-6 w-full rounded-md border border-blue-600 py-3 font-medium text-blue-600 hover:bg-blue-50"
              onClick={handleLoadMore}
            >
              Xem thêm đánh giá
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsContent;
