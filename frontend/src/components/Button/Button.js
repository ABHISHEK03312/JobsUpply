import React from 'react';
import './Button.css';

const STYLES = ['btn--primary', 'btn--outline']

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle, 
    buttonSize
    }) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]
        return(
            
                <button
                className={`btn-orange ${checkButtonStyle} ${checkButtonSize}` }
                onClick={onClick}
                typo={type}
                >
                    {children}
                </button>
            
        )
    }


export const JobHaveButton = ({
    children,
    type,
    onClick,
    buttonStyle, 
    buttonSize
    }) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]
        return(
            
                <button
                className={`btn--skillhave ${checkButtonStyle} ${checkButtonSize}` }
                onClick={onClick}
                typo={type}
                >
                    {children}
                </button>
            
        )
    }

export const JobHave = ({
children,
type,
onClick,
buttonStyle, 
buttonSize
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]
    return(
        
            <button
            className={`btn--skillhave ${checkButtonStyle} ${checkButtonSize}` }
            onClick={onClick}
            typo={type}
            >
                {children}
            </button>
        
    )
}

export const JobNo = ({
    children,
    type,
    onClick,
    buttonStyle, 
    buttonSize
    }) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]
        return(
            
                <button
                className={`btn--skilldonthave ${checkButtonStyle} ${checkButtonSize}` }
                onClick={onClick}
                typo={type}
                >
                    {children}
                </button>
            
        )
    }

export const JobProfileHave = ({
    children,
    type,
    onClick,
    buttonStyle, 
    buttonSize
    }) => {
        const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
        const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]
        return(
            
                <button
                className={`btn--skillProfilehave ${checkButtonStyle} ${checkButtonSize}` }
                onClick={onClick}
                typo={type}
                >
                    {children}
                </button>
            
        )
    }
    
    

