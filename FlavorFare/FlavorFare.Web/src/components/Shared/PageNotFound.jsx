const PageNotFound = () => { 
    const path = "/404.png";
    console.log(path);

    return (
        <div style= {{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p style={{ fontFamily: 'Alegreya, sans-serif', fontSize: '4rem', margin: 0 }}>Page Not Found</p>
            <img src="/assets/404.png" style={{ height: "400px"}} alt="Page not found" />
        </div>
    )
}

export default PageNotFound;