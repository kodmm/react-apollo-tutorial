import React from 'react';

const Link = (props) => {
    const { link } = props
    return (
        <div>
            <div>
                {link.title} ({link.address})
            </div>
        </div>

    )
}

export default Link;