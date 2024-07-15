import Illustration from '@/assets/svg/404.svg'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div>
            <div className="container flex justify-center">
                <img src={Illustration} draggable={false} className='w-[80%] lg:w-[50%] h-auto' alt='404- page not found' />
            </div>
            <div className='text-sm text-gray-500 font-Poppins text-center my-4'>
                Oops! Captian looks like you are lost !
            </div>
            <div className="flex justify-center">
                <Link to='/'>
                    <Button className='bg-red-800 text-white font-Poppins text-xl'>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound