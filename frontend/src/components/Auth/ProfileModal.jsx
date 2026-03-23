import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfilePic } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          await updateProfilePic(reader.result); // Save Base64 directly via API
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-sm p-6 relative rounded-3xl glassmorphism border border-white/10 shadow-2xl bg-background/80 flex flex-col items-center text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground/50 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold font-outfit mb-6">Profile Picture</h2>

          <div className="relative group cursor-pointer mb-6" onClick={() => !loading && fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full border-4 border-border overflow-hidden bg-secondary flex items-center justify-center relative shadow-inner">
               {user.profilePicture ? (
                 <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-12 h-12 text-foreground/30" />
               )}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Upload className="w-8 h-8 text-white" />
               </div>
            </div>
            {loading && (
              <div className="absolute inset-0 rounded-full bg-background/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            )}
          </div>

          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-foreground/50 mb-6">{user.email}</p>

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
