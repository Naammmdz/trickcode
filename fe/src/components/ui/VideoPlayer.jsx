import { useMemo } from 'react';
import { courseService } from '../../services/courseService';

/**
 * Smart video player that supports both uploaded videos (<video> tag)
 * and external embeds like YouTube (<iframe>).
 */
const VideoPlayer = ({ videoUrl, title = 'Video', className = '', onEnded }) => {
    const { isYoutube, embedUrl, nativeUrl } = useMemo(() => {
        if (!videoUrl) return { isYoutube: false, embedUrl: null, nativeUrl: null };

        const isYT = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

        if (isYT) {
            let embed = videoUrl;
            if (videoUrl.includes('watch?v=')) {
                embed = videoUrl.replace('watch?v=', 'embed/');
            } else if (videoUrl.includes('youtu.be/')) {
                const videoId = videoUrl.split('youtu.be/')[1]?.split(/[?&#]/)[0];
                embed = `https://www.youtube.com/embed/${videoId}`;
            }
            return { isYoutube: true, embedUrl: embed, nativeUrl: null };
        }

        // For uploaded videos (relative paths like /api/files/video/xxx)
        const resolvedUrl = courseService.getVideoUrl(videoUrl);
        return { isYoutube: false, embedUrl: null, nativeUrl: resolvedUrl };
    }, [videoUrl]);

    if (!videoUrl) {
        return (
            <div className={`aspect-video bg-neutral-900 rounded-lg flex items-center justify-center ${className}`}>
                <div className="text-center text-neutral-500">
                    <span className="material-symbols-outlined text-4xl mb-2 block">videocam_off</span>
                    <p className="text-sm">No video available</p>
                </div>
            </div>
        );
    }

    if (isYoutube) {
        return (
            <div className={`relative aspect-video bg-neutral-900 rounded-lg overflow-hidden ${className}`}>
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        );
    }

    // Native video player for uploaded files
    return (
        <div className={`relative aspect-video bg-neutral-900 rounded-lg overflow-hidden ${className}`}>
            <video
                className="absolute inset-0 w-full h-full"
                controls
                controlsList="nodownload"
                preload="metadata"
                playsInline
                onEnded={onEnded}
            >
                <source src={nativeUrl} type="video/mp4" />
                <source src={nativeUrl} type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
