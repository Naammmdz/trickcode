package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Section;
import com.naammm.trickcode.repository.SectionRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.naammm.trickcode.domain.Section}.
 */
@Service
@Transactional
public class SectionService {

    private static final Logger LOG = LoggerFactory.getLogger(SectionService.class);

    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    /**
     * Save a section.
     *
     * @param section the entity to save.
     * @return the persisted entity.
     */
    public Section save(Section section) {
        LOG.debug("Request to save Section : {}", section);
        return sectionRepository.save(section);
    }

    /**
     * Update a section.
     *
     * @param section the entity to save.
     * @return the persisted entity.
     */
    public Section update(Section section) {
        LOG.debug("Request to update Section : {}", section);
        return sectionRepository.save(section);
    }

    /**
     * Partially update a section.
     *
     * @param section the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Section> partialUpdate(Section section) {
        LOG.debug("Request to partially update Section : {}", section);

        return sectionRepository
            .findById(section.getId())
            .map(existingSection -> {
                if (section.getTitle() != null) {
                    existingSection.setTitle(section.getTitle());
                }
                if (section.getOrderIndex() != null) {
                    existingSection.setOrderIndex(section.getOrderIndex());
                }

                return existingSection;
            })
            .map(sectionRepository::save);
    }

    /**
     * Get all the sections.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Section> findAll(Pageable pageable) {
        LOG.debug("Request to get all Sections");
        return sectionRepository.findAll(pageable);
    }

    /**
     * Get one section by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Section> findOne(Long id) {
        LOG.debug("Request to get Section : {}", id);
        return sectionRepository.findById(id);
    }

    /**
     * Delete the section by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Section : {}", id);
        sectionRepository.deleteById(id);
    }
}
