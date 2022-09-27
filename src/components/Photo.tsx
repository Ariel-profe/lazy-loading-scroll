import { FC } from "react"
import { IPhotosResponse, Urls, User } from '../interfaces/IPhotosResponse';


interface Props {
    urls: Urls;
    description?: string;
    likes: number;
    user: User;
}

export const Photo:FC<Props> = ({urls:{regular}, description, likes, user}) => {


  return (
    <article className="photo">
        <img src={regular} alt={description} />
        <div className="photo-info">
            <h4>{user.name}</h4>
            <p>{likes} likes</p>
            <a href={user.portfolio_url!}>
                <img src={user.profile_image.medium} alt={user.name} className="user-img"/>
            </a>
        </div>
    </article>
  )
}
