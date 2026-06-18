import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Upload, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfilePic } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          await updateProfilePic(reader.result);
        } catch (err) {
          alert(err.message);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="brutal-card relative flex w-full max-w-sm flex-col items-center bg-[var(--surface)] p-6 text-center"
        >
          <button onClick={onClose} className="brutal-icon-button absolute right-4 top-4 h-10 w-10 shadow-brutalSm" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={3} />
          </button>

          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Profile</p>
          <h2 className="mt-1 text-3xl font-extrabold">Profile Picture</h2>

          <button
            type="button"
            className="brutal-button relative mt-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-[18px] bg-yellow"
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-14 w-14" strokeWidth={3} />
            )}
            <span className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-black bg-white">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} /> : <Upload className="h-5 w-5" strokeWidth={3} />}
            </span>
          </button>

          <p className="mt-6 text-xl font-extrabold">{user.name}</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">{user.email}</p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleImageChange}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
