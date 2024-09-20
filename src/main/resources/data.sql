CREATE TABLE questions (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           content VARCHAR(1000) NOT NULL,
                           option1 VARCHAR(255) NOT NULL,
                           option2 VARCHAR(255) NOT NULL,
                           option3 VARCHAR(255) NOT NULL,
                           option4 VARCHAR(255) NOT NULL,
                           option5 VARCHAR(255) NOT NULL,
                           correct_answer INT NOT NULL
);

CREATE TABLE chat_messages (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               sender VARCHAR(255) NOT NULL,
                               content VARCHAR(1000) NOT NULL,
                               type VARCHAR(50) NOT NULL,
                               timestamp TIMESTAMP NOT NULL
);

CREATE TABLE answers (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         question_id BIGINT NOT NULL,
                         user_id VARCHAR(255) NOT NULL,
                         selected_option INT NOT NULL,
                         correct BOOLEAN NOT NULL,
                         timestamp TIMESTAMP NOT NULL
);

CREATE TABLE rank (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        user_name VARCHAR(255) NOT NULL,
                        total_score INTEGER NOT NULL,
                        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

INSERT INTO questions (content, option1, option2, option3, option4, option5, correct_answer) VALUES
                                                                                                 ('AWS EKS에서 Kubernetes 클러스터를 생성하기 위해 필요한 리소스는 무엇입니까?', 'IAM 역할', 'VPC', 'EC2 인스턴스', 'S3 버킷', 'DynamoDB 테이블', 2),
                                                                                                 ('Kubernetes에서 Pod의 스케줄링을 담당하는 컴포넌트는 무엇입니까?', 'kubelet', 'kube-proxy', 'Controller Manager', 'Scheduler', 'Etcd', 4),
                                                                                                 ('Kubernetes에서 Deployment의 주 목적은 무엇입니까?', '애플리케이션의 배포와 스케일링 관리', '네트워크 트래픽 라우팅', '데이터베이스 관리', '스토리지 프로비저닝', '보안 정책 적용', 1),
                                                                                                 ('AWS EKS 클러스터에서 워커 노드를 실행하기 위해 사용되는 서비스는 무엇입니까?', 'AWS Fargate', 'AWS Lambda', 'Amazon RDS', 'AWS S3', 'Amazon EMR', 1),
                                                                                                 ('Kubernetes에서 서비스 디스커버리를 제공하는 객체는 무엇입니까?', 'ConfigMap', 'Service', 'Ingress', 'Volume', 'Secret', 2),
                                                                                                 ('Kubernetes에서 컨테이너의 구성 정보를 저장하기 위해 사용하는 객체는 무엇입니까?', 'Secret', 'Service', 'ConfigMap', 'PersistentVolume', 'Namespace', 3),
                                                                                                 ('EKS에서 클러스터를 관리하기 위해 필요한 CLI 도구는 무엇입니까?', 'eksctl', 'awsctl', 'kubectl', 'docker', 'helm', 1),
                                                                                                 ('Kubernetes에서 파드를 동일한 네트워크 내에서 격리하기 위해 사용하는 것은 무엇입니까?', 'Service', 'Namespace', 'Node', 'Volume', 'Deployment', 2),
                                                                                                 ('Kubernetes에서 StatefulSet은 어떤 유형의 애플리케이션에 사용됩니까?', '무상태(stateless) 애플리케이션', '상태 저장(stateful) 애플리케이션', '배치 작업(batch jobs)', '데몬셋(daemonsets)', '크론잡(cronjobs)', 2),
                                                                                                 ('AWS EKS에서 클러스터 로깅을 활성화하기 위해 사용할 수 있는 서비스는 무엇입니까?', 'AWS CloudTrail', 'Amazon Kinesis', 'Amazon CloudWatch Logs', 'AWS SNS', 'AWS SES', 3);
