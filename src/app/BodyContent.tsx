import PageLoading from "@/components/PageLoading";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { GlobalAppContext, IGlobalAppContextValue } from "hooks/globalAppContext";
import { useContext } from "react";

export default function BodyContent(props: any) {
    const gac = useContext<IGlobalAppContextValue>(GlobalAppContext);

    console.log(gac.user);

    if (!gac.user) {
        return (<div></div>);
    }

    return (
        <>
            <Navbar />
            <main>{props.children}</main>
            <Footer></Footer>
        </>
    );
}