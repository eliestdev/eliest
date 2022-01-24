package implement

import (
	"errors"
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/sharedmodel"
	"lottosupervisor/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	SupervisorDb *gorm.DB
	AgentDb      *gorm.DB
	AdminDb      *gorm.DB
	FinanceDb    *gorm.DB
}

func NewSqlLayer(supervisor, agent, admin, finance string) *SqlLayer {
	db, err := gorm.Open(mysql.Open(supervisor), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	agdb, err := gorm.Open(mysql.Open(agent), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	addb, err := gorm.Open(mysql.Open(admin), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open admin database: %v", err)
	}

	findb, err := gorm.Open(mysql.Open(finance), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open admin database: %v", err)
	}

	return &SqlLayer{SupervisorDb: db, AgentDb: agdb, AdminDb: addb, FinanceDb: findb}
}

func (sql *SqlLayer) CreateSupervisor(arg *sharedmodel.Supervisor) (string, error) {
	session := sql.SupervisorDb
	err := session.Create(&arg).Error
	if err != nil {
		return "", err
	}
	return arg.Id, nil
}

func (sql *SqlLayer) FindSupervisor(arg *sharedmodel.Supervisor) (*sharedmodel.Supervisor, error) {
	session := sql.SupervisorDb
	var result sharedmodel.Supervisor

	if errors.Is(session.Where(arg).First(&result).Error, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	return &result, nil
}

func (sql *SqlLayer) DeleteSupervisor(arg *sharedmodel.Supervisor) (*sharedmodel.Supervisor, error) {
	session := sql.SupervisorDb
	var result sharedmodel.Supervisor

	if errors.Is(session.Where(arg).Delete(&result).Error, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	return &result, nil
}

func (sql *SqlLayer) FindSupervisors(arg map[string]interface{}) ([]sharedmodel.Supervisor, error) {
	session := sql.SupervisorDb
	var result []sharedmodel.Supervisor
	err := session.Where(arg).Find(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (sql *SqlLayer) UpdateSupervisor(old, new *sharedmodel.Supervisor) error {
	session := sql.SupervisorDb
	return session.Model(old).Updates(new).Error
}

func (sql *SqlLayer) CreateTarget(arg *sharedmodel.SupervisorTarget) (string, error) {
	session := sql.SupervisorDb
	err := session.Create(&arg).Error
	if err != nil {
		return "", err
	}
	return arg.Id, err
}

func (sql *SqlLayer) GetTarget(arg *sharedmodel.SupervisorTarget) (*sharedmodel.SupervisorTarget, error) {
	session := sql.SupervisorDb
	var result sharedmodel.SupervisorTarget
	err := session.Where(arg).First(&result).Error
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (sql *SqlLayer) DeleteTarget(arg *sharedmodel.SupervisorTarget) (*sharedmodel.SupervisorTarget, error) {
	session := sql.SupervisorDb
	var result sharedmodel.SupervisorTarget
	err := session.Where(arg).Delete(&result).Error
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (sql *SqlLayer) GetTargets(arg map[string]interface{}) ([]sharedmodel.SupervisorTarget, error) {
	session := sql.SupervisorDb
	var result []sharedmodel.SupervisorTarget
	err := session.Where(arg).Find(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (sql *SqlLayer) DeleteTargets(arg map[string]interface{}) ([]sharedmodel.SupervisorTarget, error) {
	session := sql.SupervisorDb
	var result []sharedmodel.SupervisorTarget
	err := session.Where(arg).Delete(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (sql *SqlLayer) UpdateTarget(old, new *sharedmodel.SupervisorTarget) error {
	session := sql.SupervisorDb
	return session.Model(old).Updates(new).Error
}

func (sql *SqlLayer) CreateTargetAssignment(arg *sharedmodel.TargetAssignment) (string, error) {
	session := sql.SupervisorDb
	err := session.Create(&arg).Error
	if err != nil {
		return "", err
	}
	return arg.Id, err
}

func (sql *SqlLayer) CreateTargetReward(arg *sharedmodel.TargetReward) (string, error) {
	session := sql.SupervisorDb
	err := session.Create(&arg).Error
	if err != nil {
		return "", err
	}
	return arg.Id, err
}

func (sql *SqlLayer) GetTargetAssignment(arg *sharedmodel.TargetAssignment) (*sharedmodel.TargetAssignment, error) {
	session := sql.SupervisorDb
	var result sharedmodel.TargetAssignment
	err := session.Where(arg).First(&result).Error
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (sql *SqlLayer) GetTargetAssignments(arg map[string]interface{}) ([]sharedmodel.AssignmentQuery, error) {
	session := sql.SupervisorDb
	var response []sharedmodel.AssignmentQuery
	var result []sharedmodel.TargetAssignment
	err := session.Where("supervisor = 'all'").Or(arg).Find(&result).Error
	if err != nil {
		return nil, err
	}
	for _, asg := range result {
		target, err := sql.GetTarget(&sharedmodel.SupervisorTarget{Id: asg.Target})
		if err != nil {
			target = &sharedmodel.SupervisorTarget{}
		}
		response = append(response, sharedmodel.AssignmentQuery{Target: *target, Assignment: asg})
	}
	return response, nil
}

func (sql *SqlLayer) DeleteTargetAssignments(arg map[string]interface{}) ([]sharedmodel.AssignmentQuery, error) {
	session := sql.SupervisorDb
	var response []sharedmodel.AssignmentQuery
	var result []sharedmodel.TargetAssignment
	err := session.Where("supervisor = 'all'").Or(arg).Find(&result).Error
	if err != nil {
		return nil, err
	}
	for _, asg := range result {
		target, err := sql.GetTarget(&sharedmodel.SupervisorTarget{Id: asg.Target})
		if err != nil {
			target = &sharedmodel.SupervisorTarget{}
		}
		response = append(response, sharedmodel.AssignmentQuery{Target: *target, Assignment: asg})
	}
	return response, nil
}

func (sql *SqlLayer) UpdateTargetAssignment(old, new *sharedmodel.TargetAssignment) error {
	session := sql.SupervisorDb
	return session.Model(old).Updates(new).Error
}

func (sql *SqlLayer) GetAgentDownline(id string) ([]sharedmodel.Agent, error) {
	session := sql.AgentDb
	var reg []sharedmodel.Agent
	err := session.Where(&sharedmodel.Agent{Id: id}).Find(&reg).Error

	if err != nil {
		return nil, err
	}

	return reg, err
}

func (sql *SqlLayer) FindAgent(arg models.NonPayingSupervisorAgentPayload) ([]sharedmodel.Agent, error) {
	args := sharedmodel.Agent{RefCode: arg.RefCode}
	session := sql.AgentDb
	var dtV []sharedmodel.Agent

	err := session.Where(&args).Find(&dtV).Error
	if err != nil {
		return nil, err
	}
	return dtV, nil
}

func (sql *SqlLayer) FindAgents(arg string) ([]sharedmodel.Agent, error) {
	args := sharedmodel.Agent{Referrer: arg}
	session := sql.AgentDb
	var dtV []sharedmodel.Agent

	err := session.Where(&args).Find(&dtV).Error
	if err != nil {
		return nil, err
	}
	return dtV, nil
}

func (sql *SqlLayer) UpdateAgent(old, new *sharedmodel.Agent) error {
	session := sql.AgentDb
	return session.Model(old).Updates(new).Error
}

func (sql *SqlLayer) GetSupervisorAdminAssignCount() ([]models.SupervisorAmountCount, error) {
	session := sql.AdminDb
	var res []models.SupervisorAmountCount

	err := session.Model(&models.SupervisorAmountCount{}).Find(&res).Error

	if err != nil {
		return nil, err
	}
	return res, nil
}

func (sql *SqlLayer) FindUnAssignedAgents(count int64) ([]sharedmodel.Agent, error) {
	session := sql.AgentDb
	args := sharedmodel.Agent{Supervisor: ""}
	var res []sharedmodel.Agent

	err := session.Where(&args).Limit(int(count)).Find(&res).Error

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (sql *SqlLayer) FindSupervisorAgents(id string) ([]sharedmodel.Agent, error) {
	session := sql.AgentDb
	args := sharedmodel.Agent{Supervisor: id}
	var res []sharedmodel.Agent

	err := session.Where(&args).Find(&res).Error

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (sql *SqlLayer) FindTransactions(arg map[string]interface{}) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var results []sharedmodel.Transaction
	rangemap := make(map[string]interface{}, 2)
	if _, ok := arg["from"]; !ok {
		rangemap["from"] = constants.LONGAGO
		rangemap["to"] = constants.FARAWAY
	} else {
		rangemap["from"] = arg["from"]
		rangemap["to"] = arg["to"]
		delete(arg, "from")
		delete(arg, "to")
	}
	log.Println(rangemap)
	log.Println(arg)
	err := session.Where(arg).Where("created_at >= ? AND created_at <= ?", rangemap["from"], rangemap["to"]).Order("created_at DESC").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}
