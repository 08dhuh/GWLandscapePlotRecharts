export const useVanDenHeuvel = (vdhattr) => {
    const [imageIndex, setImageIndex] = useState(null);
    const [eventSequenceIndex, setEventSequenceIndex] = useState(null);
    const [eventString, setEventString] = useState(null);
    const [rotateImage, setRotateImage] = useState(false);

    const getEvents = () => {
        // Extract Vandenheuvel logic here
    };

    useEffect(() => {
        getEvents();
    }, [vdhattr]);

    return { imageIndex, eventSequenceIndex, eventString, rotateImage };
};
