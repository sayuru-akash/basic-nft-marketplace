import {FunctionComponent} from "react";
import {Navbar} from "@/components";

// @ts-ignore
const BaseLayout: FunctionComponent = ({children}) => {
    return(
        <>
        <Navbar/>
        <div className="py-16 bg-gray-50 overflow-hidden min-h-screen">
            <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
                {children}
            </div>
        </div>
        </>
    )
}

export default BaseLayout;

