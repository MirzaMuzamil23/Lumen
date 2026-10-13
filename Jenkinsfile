pipeline {
    agent any

    environment {
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        PUBLIC_API_URL = 'http://184.193.139.186:4000/api'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Build backend image') {
            steps {
                sh 'docker build -t lumen-backend:${IMAGE_TAG} ./backend'
            }
        }

        stage('Build frontend image') {
            steps {
                sh 'docker build -t lumen-frontend:${IMAGE_TAG} --build-arg NEXT_PUBLIC_API_URL=${PUBLIC_API_URL} ./frontend'
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo 'Pipeline pass hui'
        }
        failure {
            echo 'Pipeline fail hui, console output dekho'
        }
    }
}
