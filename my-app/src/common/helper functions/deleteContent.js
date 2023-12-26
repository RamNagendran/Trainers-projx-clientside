

export function deleteContent(props) {

    return (
        <div className="d-flex flex-column flex-md-row flex-lg-row align-items-start"
            style={{ color: "#aaaaaa", fontSize: "15px", fontWeight: 700 }
            }
        >
            <div>Are you sure want to delete ? </div>
            < div style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "15px",
                color: "#005bc5"
            }}
            > {`‘${props}’`}</div>
        </div>
    )
}

