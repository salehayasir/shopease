pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/salehayasir/shopease.git'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Build - Docker Compose') {
            steps {
                sh 'docker compose -f docker-compose.ci.yml build'
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker compose -f docker-compose.ci.yml up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        failure {
            sh 'docker compose -f docker-compose.ci.yml down'
            echo 'Pipeline failed. Containers stopped.'
        }
    }
}
