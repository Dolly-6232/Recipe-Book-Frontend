import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Carosal = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    }

    const images = [
        "/assets/carosal1.jpg",
        "/assets/carosal2.jpg",
        "/assets/carosal3.jpg"
    ]

    return (
        <div className="w-[95%] mx-auto mt-4 sm:mt-6 md:mt-8">
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index}>
                        <img src={img} className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl shadow-lg" />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Carosal