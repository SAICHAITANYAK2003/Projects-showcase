import {Component} from 'react'

import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusContants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    apiStatus: apiStatusContants.initial,

    projectsData: [],
    activeCategory: 'ALL',
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({
      apiStatus: apiStatusContants.inProgress,
    })
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        projectsData: updatedData,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsList)
  }

  renderSuccessView = () => {
    const {projectsData} = this.state

    return (
      <ul className="projects-list">
        {projectsData.map(eachProject => (
          <ProjectItem projectDetails={eachProject} key={eachProject.id} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-subtitle">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-btn"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderProjectDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderSuccessView()
      case apiStatusContants.inProgress:
        return this.renderLoaderView()
      case apiStatusContants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {optionValue} = this.state

    return (
      <div className="main-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="nav-logo"
            alt="website logo"
          />
        </nav>
        <div className="select-container">
          <select
            className="select"
            value={optionValue}
            onChange={this.onChangeOption}
          >
            {categoriesList.map(eachOption => (
              <option value={eachOption.id} key={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
        </div>
        <div className="data-container">{this.renderProjectDetails()}</div>
      </div>
    )
  }
}

export default Projects
