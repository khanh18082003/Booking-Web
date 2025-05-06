import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const ProfileAvatarModal = ({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
  onDelete,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile, previewImage);
    }
    onClose();
  };

  const handleDelete = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Chọn hình ảnh để tải lên
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300">
            <img
              src={previewImage || currentAvatar}
              alt="Profile Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* File select button */}
          <button
            onClick={handleSelectFile}
            className="mb-4 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            Chọn tệp tin
          </button>
        </div>

        <div className="flex justify-between border-t border-gray-300 pt-4">
          <button
            onClick={handleDelete}
            className="rounded-md border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Xóa
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile && !previewImage}
            className={`rounded-md px-4 py-2 ${
              !selectedFile && !previewImage
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

ProfileAvatarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentAvatar: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileAvatarModal;
