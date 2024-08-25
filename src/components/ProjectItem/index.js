import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {id, imageUrl, name} = projectDetails
  return (
    <li className="project-item" key={id}>
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-title">{name}</p>
    </li>
  )
}

export default ProjectItem
