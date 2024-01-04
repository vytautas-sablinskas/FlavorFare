import { useParams } from 'react-router-dom';
import Tables from "../Tables/index";

export default function TablesWrapper() {
    const params = useParams();
    const { restaurantId } = params;
    return <Tables restaurantId={restaurantId} />;
}