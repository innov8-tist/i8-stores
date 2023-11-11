import instance from "@/Helpers/Config/axios.config"
import Card from "@/components/card"
import { toast } from "react-toastify"
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import Navbarv2 from '../components/Navbarv2'
import { addToCart } from "@/Store/Cart.Slice"

export default function all() {
    let user = useSelector((state)=>state.auth)
    let [products, setProducts] = useState([])
    let dispatch = useDispatch()
    let router = useRouter()

    const fetch_all_products = async () => {
        await instance.get('/user/product/all')
            .then((response) => setProducts(response.data.data))
            .catch((_) => toast("Error Occcured"))
    }

    const add_to_cart = async(product) => {
        await instance.post('/user/addtocart',{productid:product.proId})
            .then((response)=>{
                dispatch(addToCart(product))
                toast.dark("Added to cart")
            })
            .catch((err)=>{
                console.log(err)
                toast.error("error occured")
            })
    }

    useEffect(() => {
        if(!user || user.token == null || user.loggedIn == false ){
            toast.dark("You must login")
            router.push('/auth/login')
        }else{
            fetch_all_products()
        }
    }, [user])

    return (
        <>
        <Navbarv2 />
        <div style={{ display: 'flex', flexDirection: "row", flexWrap: "wrap", gap: '3rem', justifyContent: 'center', marginTop: '30rem' }}>
            {
                products && products.map((item) =>
                    <Card  prodPrice={item.prodprice} proId={item._id} prodName={item.prodName} prodDesc={item.proddesc} addtoCart={(id)=>add_to_cart(id)} />
                )

            }
        </div>
        </>
    )
}

