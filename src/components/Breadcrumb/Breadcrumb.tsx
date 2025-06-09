import { FC, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { PageLink } from '@/interfaces/layout'

type Props = {
  links: Array<PageLink>
  currentPage?: string
}

const Breadcrumb: FC<Props> = ({ links, currentPage }) => {
  return (
    <ul className="breadcrumb fw-medium fs-base my-1">
      {links
        .filter((t) => !t.isSeparator)
        .map((item, index) => (
          <Fragment key={`${item.path}${index}`}>
            {item.isActive ? (
              <li className="breadcrumb-item text-primary">{item.title}</li>
            ) : (
              <li className="breadcrumb-item text-gray-600">
                <Link
                  to={item.path}
                  className="text-gray-600"
                >
                  {item.title}
                </Link>
              </li>
            )}
          </Fragment>
        ))}
      <li className="breadcrumb-item text-primary">{currentPage}</li>
    </ul>
  )
}

export { Breadcrumb }
