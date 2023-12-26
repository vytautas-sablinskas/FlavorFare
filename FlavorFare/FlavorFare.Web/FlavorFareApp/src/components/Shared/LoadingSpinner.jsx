import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        }}>
            <CircularProgress size={50} thickness={8} style={{ color: '#138c94' }} />
            <span style={{ marginLeft: '10px', fontSize: '2rem', fontWeight: 'bold' }}>LOADING...</span>
        </div>
    );
}

export default LoadingSpinner;